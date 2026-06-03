# Modules

A *module* is a self-contained widget that the user can add to one of the
portal columns (clock, feed reader, todo list, …). Modules are plain React
components. This document describes how they are wired into the app, the props
they receive, and — most importantly — **how to store state correctly so it
persists and syncs across devices**.

## Anatomy of a module

```
modules/
  Clock/
    index.jsx          # required – the display component (default export)
    Configuration.jsx  # optional – the settings form (default export)
  Feed/
    index.jsx
    Configuration.jsx
    mapFeedItems.js    # any number of private helper files
  Welcome.jsx          # trivial modules can be a single file
```

- **`index.jsx`** default-exports the component rendered on the dashboard.
- **`Configuration.jsx`** default-exports the form shown in the settings modal.
  It is optional — a module without it simply has no user-editable settings
  (e.g. `TodoList`, `MorningRoutine` configure themselves through use).
- Trivial modules with no own directory live as a single file directly under
  `modules/` (`Welcome.jsx`, `NotFound.jsx`).

Both `index.jsx` and `Configuration.jsx` are loaded with `React.lazy`, so keep
heavy imports (chart libraries, parsers) inside the module — they will be code
split automatically.

## Registering a module

A new module has to be registered in **two** places, plus the dropdown:

1. **Display component** — `components/Modules.jsx`, in `availableModules`:

   ```js
   const availableModules = {
     clock: lazy(() => import('../modules/Clock')),
     morningRoutine: lazy(() => import('../modules/MorningRoutine')),
     // …add your key here
   }
   ```

2. **Configuration component** — `components/Settings/Modules.jsx`, in *its*
   `availableModules` map. **Only add an entry here if your module has a
   `Configuration.jsx`.** A missing entry simply hides the settings cog.

3. **The "Module" dropdown** — `components/Settings/Modules.jsx`, add an
   `<option value="yourKey">Human Label</option>` to the module-type `<select>`
   so users can add it.

The key you choose (`clock`, `morningRoutine`, …) is the module's `type`. It is
stored in the configuration and used to look the component back up, so don't
rename it once modules of that type exist in the wild.

## Props

### Display component (`index.jsx`)

```jsx
export default function MyModule ({ configuration, updateModuleConfiguration }) { … }
```

| Prop                         | Description                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| `configuration`              | This module's persisted config object. Always contains `type` and `id`; everything else is yours. |
| `updateModuleConfiguration`  | `(newConfiguration) => void`. Replaces this module's config and triggers persistence + sync. |

### Configuration component (`Configuration.jsx`)

```jsx
export default function MyConfiguration ({ configuration, setConfiguration }) { … }
```

| Prop              | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| `configuration`   | Same config object as above.                                               |
| `setConfiguration`| `(key, value) => void`. Sets a single top-level key on the configuration.  |

Note the asymmetry: the **display** component gets a whole-object setter
(`updateModuleConfiguration`), the **settings** form gets a per-key setter
(`setConfiguration`). Both ultimately write to the same place.

## State & persistence

This is the important part.

There are exactly two kinds of state in a module:

### 1. Ephemeral, device-local UI state → `useState`

State that is meaningless to persist and must never sync: the current time
tick, the contents of an input field before it is submitted, a "which tab is
open" flag, fetched remote data (see [Fetching data](#fetching-remote-data)).

```jsx
const [time, setTime] = useState(new Date())          // Clock
const [newTodo, setNewTodo] = useState('')            // TodoList input buffer
const [feedItems, setFeedItems] = useState([])        // Feed, fetched data
```

### 2. Persistent state that must survive reload **and** sync across devices → the configuration

Anything the user would expect to "stick" — todo items, which feed entries are
read, which routine days are done — **must** live in `configuration` and be
written through `updateModuleConfiguration`:

```jsx
// Feed: remember which items were read
const markRead = () => {
  configuration.read = feedItems.map((item) => item.id)
  updateModuleConfiguration({ ...configuration })
}

// TodoList: add an item
updateModuleConfiguration({ ...configuration, todos: [...todos, newItem] })

// MorningRoutine: record today's completion
updateModuleConfiguration({ ...configuration, completions: next })
```

> ⚠️ **Never use `localStorage` (or `sessionStorage`, cookies, IndexedDB)
> directly from a module to store user state.** It is device-local and will not
> sync. Persisting through `updateModuleConfiguration` is the *only* way state
> reaches other devices.

#### Why this works

The whole `modules` array is the synchronized state. The zustand store in
`utils/store.js` persists it to `localStorage` and — when the user has enabled
synchronization — encrypts it and pushes it to the backend (debounced, 1s).
`updateModuleConfiguration` writes your config back into that array and calls
`setModules`, which flips `synchronizedStateHasChanges` and triggers the sync.
So every config write is automatically saved and synced; nothing else is.

#### Always create a new object reference

Change detection is reference-based. You **must** spread into a fresh object so
the store sees a change:

```jsx
updateModuleConfiguration({ ...configuration, todos: next })  // ✅ new ref
```

It is fine (and common in this codebase) to mutate `configuration` and then
spread it (`configuration.read = […]; updateModuleConfiguration({ ...configuration })`),
but the spread is not optional — without it the update may be dropped.

#### Keep the configuration small

The configuration is serialized, encrypted and uploaded on **every** change, and
it lives forever. Do not store unbounded history. Cap anything that grows:

- `Feed` keeps only the last 256 read item ids (`configuration.read.slice(-256)`).
- `MorningRoutine` keeps only the last 60 days of completions.

If your state grows per-day or per-item, trim it before writing.

## Fetching remote data

Browsers block cross-origin requests, so external feeds/calendars/APIs go
through the server-side proxy. Fetched data is transient — keep it in `useState`,
**not** in the configuration.

```jsx
import axios from 'axios'
import useStore, { API_AUTH_HEADER } from '../../utils/store'
import { useShallow } from 'zustand/react/shallow'

const pushError = useStore(useShallow((store) => store.pushError))

const url =
  'https://local-storage-storage.io/proxy/portalific?url=' +
  encodeURIComponent(remoteUrl)

const response = await axios.get(url, { headers: API_AUTH_HEADER })
```

Refresh on an interval inside an effect keyed on the relevant config, and clean
up the interval:

```jsx
useEffect(() => {
  update()
  const interval = setInterval(update, 5 * 60 * 1000)
  return () => clearInterval(interval)
}, [configuration.feeds])
```

See `Feed/index.jsx` and `Calendar/index.jsx` for the full pattern (fan-out
with `utils/resolveAllPromises`, then parse). `WebStats/index.jsx` shows the
alternative `fetch` + basic-auth approach for an API that isn't a feed.

## Error handling

Modules are wrapped in an `ErrorBoundary`, so an uncaught throw won't take down
the app — but the user just sees a blank module. Prefer reporting recoverable
errors (failed fetches, bad responses) through the store's `pushError`, which
surfaces them as notifications:

```jsx
const pushError = useStore(useShallow((store) => store.pushError))

feed.response.catch((response) => {
  pushError(response.message, `Feed: ${feed.name}, URL: ${feed.feed}`)
})
```

`pushError(message, context)` — the second argument is free-form context shown
with the error.

## Timers

Use `setInterval` inside `useEffect` and always clear it on unmount:

```jsx
useEffect(() => {
  const interval = setInterval(() => setTime(new Date()), 1000)
  return () => clearInterval(interval)
}, [])
```

(Beware shadowing: `WebStats` deliberately names a state variable `interval`,
which shadows the global `setInterval`/`clearInterval`. Don't copy that unless
you mean to.)

## Styling

Styles are global and follow BEM, namespaced by a block named after the module:
`clock__time`, `feed__item`, `todo-list__item`, `morning-routine__title`. Add
your module's block to `styles/globals.scss` (and, where relevant, the theme
files `theme-*.scss`). Reuse existing blocks when it fits — `MorningRoutine`
renders its steps with the shared `todo-list` block. Settings forms reuse the
`settings__*` classes (`settings__section`, `settings__input`,
`settings__switch`, …); copy an existing `Configuration.jsx` rather than
inventing new ones.

## Device visibility

Per-device hide/show (`hiddenOnDevices`) is handled entirely by the framework
(`components/Module.jsx` and `components/Settings/Modules.jsx`). Modules don't
need to do anything for it.

## Checklist for a new module

1. Create `modules/MyModule/index.jsx` exporting the display component.
2. (Optional) Create `modules/MyModule/Configuration.jsx` for settings.
3. Register the display component in `components/Modules.jsx`.
4. If it has settings, register `Configuration.jsx` in
   `components/Settings/Modules.jsx` and add an `<option>` to the type dropdown.
5. Store ephemeral state in `useState`; store anything that must persist/sync in
   `configuration` via `updateModuleConfiguration` — **never** `localStorage`.
6. Cap any state that can grow without bound.
7. Route remote requests through the proxy and report failures via `pushError`.
8. Add BEM styles under your module's block in `styles/globals.scss`.
```
