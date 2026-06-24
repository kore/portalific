# HTML & CSS Code Style

Portalific is a React app, but its markup and styling follow the
**"style the document, not a component tree"** approach. React owns behaviour
and data flow; the look comes from semantic HTML styled with plain, layered CSS.

See the background articles:

- <https://kore-nordmann.de/blog/htmx-and-web-components-instead-of-react.html>
- <https://kore-nordmann.de/blog/style-the-document-not-a-component-tree.html>

## Principles

1. **Semantic HTML first.** Use the element that describes the content
   (`<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`, `<dialog>`,
   `<details>`, `<time>`, `<button>`, `<label>`, `<ul>`/`<li>`). Reach for
   `<div>`/`<span>` only when no semantic element fits.
2. **Style elements directly.** Within a block, style child elements
   (`.feed-header`, `.calendar-day` … then `h2`, `p`, `time`) instead of giving
   every node its own class.
3. **Classes are a last resort** — flat, `kebab-case`, descriptive of what a
   thing *is* (`.feed-link`, `.todo-item`). **Never** BEM
   (`block__element--modifier`), CSS Modules, or generated names.
4. **Variants and states are data attributes**, not modifier classes:
   `data-variant="primary"`, `data-status="overdue"`, `data-phase="pause"`,
   `data-hidden="mobile tablet"`, `aria-current="page"`, `aria-pressed`.
5. **All colours and spacing are CSS variables** defined in
   `styles/global.css`. No hard-coded hex values or magic pixel numbers.
6. **No inline styles for static values.** Genuinely dynamic values are passed
   as custom properties, e.g. `style={{ '--accent': color }}`, and consumed in
   CSS (`border-left-color: var(--accent)`). The only inline styles left are
   per-instance geometry (the analog clock hands) and the user's background
   image/colour.

## CSS architecture (CubeCSS)

Plain `.css` only — **no Sass, no preprocessor, no build step**. Files in
`styles/`, imported in this order by `main.jsx`:

| File | Layer | Holds |
|---|---|---|
| `global.css` | Global | `:root` variables, themes, reset, base element styles |
| `composition.css` | Composition | layout primitives: `.layout`, `.grid`/`.grid-N` |
| `utilities.css` | Utility | single-purpose helpers (`.sr-only`) — sparingly |
| `blocks.css` | Block | block classes + their child-element styles |
| `exceptions.css` | Exception | `[data-*]` variants/states + theme overrides |
| `print.css` | Print | print-only overrides |

Native CSS nesting, `:has()`, `:is()`, `:not()`, `@scope` are all fair game;
keep selectors flat (one level of nesting max) and specificity low. No
`!important` (the single exception is the `prefers-reduced-motion` reset).

## Theming

Themes and dark mode are document-level attributes set on
`document.documentElement` (see `components/Layout.jsx`):

- `data-variant="dark"` — dark mode (applies to the default theme).
- `data-theme="black" | "green"` — named themes; the default theme is the bare
  `:root`.

Token overrides live in `global.css` (`:root[data-theme="black"] { … }`);
theme-specific block tweaks live in `exceptions.css`
(`:root[data-theme="green"] .module[data-module="clock"] { … }`). Anything that
needs theme colours at runtime (the charts) reads them from
`getComputedStyle(document.documentElement)`.

## Shared components

These stay in React, but wrap native elements so the document styling and
accessibility come for free:

- **`components/Modal.jsx`** wraps a native `<dialog>` (`showModal()`/`close()`,
  `::backdrop`, free focus trap and Escape handling).
- **`components/Switch.jsx`** is a native `<input type="checkbox" role="switch">`
  styled as a toggle (`.switch` + `.switch::before`).
- The feed "mark read" menu is a native `<details>`/`<summary>`.

## Buttons

- Call-to-action: `<button className="button" data-variant="primary|secondary|danger">`.
- Icon-only: `<button className="icon-button" data-variant="settings|error|danger">`.

Both keep `type="button"` unless they submit a form, and an `aria-label` or
`.sr-only` text when the label is an icon.
