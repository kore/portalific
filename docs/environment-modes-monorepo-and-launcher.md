# Environment Modes, Monorepo Consolidation and an Android Launcher

Status: **draft / under discussion**, second pass. The direction is decided;
the details below are not. Sections record the decision taken, what follows
from it, and what is still open. Open points are marked and meant to be
answered inline.

## The proposal

Three pieces of work, deliberately entangled:

1. Implement the *environment modes* idea already sketched in the README
   (Work, Relax, Travelling, Vacation — chosen explicitly or derived from
   time, location, device).
2. Merge `LocalStorageStorage` into this repository as the backend.
3. Fork an Android launcher so it knows about the same environments, can
   configure its icon layout per environment, and replaces the Google
   Discover panel (swipe right) with a feed built from the configured
   portalific modules.

The result is restructured as a monorepo containing frontend, backend and the
Android app. Each module configuration then carries device visibility (exists
today), environment selectors, and launcher visibility.

## 1. Launcher base: Launcher3

Pixel Launcher is proprietary (NexusLauncher) and cannot be forked. The
realistic bases are **Launcher3** (AOSP, Apache-2.0) and **Lawnchair**
(GPL-3.0, a maintained Launcher3 delta with extensive configuration UI).

**Decision:** Launcher3. The goal is a minimal launcher — the default slim
experience plus environments, not another configurable one.

Consequences:

- **The standalone-build tax is real and recurring.** Launcher3 is not
  shipped as a consumable library. It builds inside the AOSP tree against
  `@hide` framework APIs, `iconloaderlib` and SystemUI shared code. Porting
  it to build against the public SDK is precisely the patch set Lawnchair
  exists to carry; choosing Launcher3 means paying that cost up front and
  again at every AOSP version bump. Budget for it explicitly rather than
  discovering it in week one.
- **The overlay IPC disappears, which is a large simplification.** The
  Discover panel is not part of the launcher: it is a `LauncherOverlay` /
  `LauncherClient` binding to a service exported by the Google app. Because
  the replacement panel is our own feed reader running in our own process
  (§7), none of that protocol is needed — no service binding, no IPC, no
  Google interface to reimplement. It is a custom content page on the -1
  screen, in-process. This is meaningfully easier than the first pass
  suggested.
- **Licensing** stays simple: Launcher3 is Apache-2.0, portalific EUPL-1.2.
  Per-package `LICENSE` files are still required; a single root license would
  be wrong.

References:

- <https://android.googlesource.com/platform/packages/apps/Launcher3/> —
  upstream. Branches `main` plus `aml_*`, tags through the Android 16/17
  release lines. There is no GitHub mirror; `aosp-mirror` does not carry
  Launcher3.
- <https://android.googlesource.com/platform/frameworks/libs/systemui/> —
  `iconloaderlib` and the other shared SystemUI libraries Launcher3 depends
  on. Separate repository, needed for any build.
- <https://github.com/LawnchairLauncher/lawnchair> — not the fork base, but
  the reference for *how* to port. Their `16-dev` branch is Launcher3 from
  Android 16 with a working Gradle build, so it shows which `@hide`
  dependencies need stubbing. Their history is ~87k commits, almost all of it
  the customization layer we explicitly do not want.

The root of the upstream tree confirms the porting cost rather than leaving it
an assumption: it contains `Android.bp` and no `build.gradle`, with
`AndroidManifest.xml` split against `AndroidManifest-common.xml` for build
variants. It is a Soong module intended to build inside the AOSP tree, and
there is no supported standalone build.

## 2. The configuration schema becomes a cross-language API contract

**Decision:** the launcher reads the same synced document as the web app, not
a derived projection. The document's structure may change to accommodate this.

This remains the largest gap. Today module configuration is an unversioned
free-form blob — `modules: [[{ type, id, ... }]]` in `utils/store.js`, with
`sanitizeModules()` as the only validation, each module free to store whatever
it likes under its own entry. That is fine while exactly one implementation
reads it.

With a second, independently released implementation, the blob becomes a
public API. An old launcher and a new web app will routinely write the same
document. What is required:

- a `schemaVersion` field in the synced document,
- a migration chain, running in one direction only,
- **unknown fields and unknown module types preserved, never dropped** —
  `sanitizeModules()` currently discards entries it does not understand, which
  under two implementations is silent data loss: an older client would strip
  modules a newer client added,
- a written schema per module type,
- contract tests running shared fixtures against both parsers.

Because the structure is going to change anyway, versioning and the
preserve-unknowns rule should land in the *same* change as the restructure,
not after it.

## 3. Encryption: specify the format, store the password

`utils/encryption.js` is PBKDF2 → AES-GCM. The parameters exist only in the
code, and the iteration count is `1024` with a `// Make this configurable by
the user?` comment attached. That is low.

**Decision:** the password is entered once on the phone and then held in the
Android Keystore.

Consequences:

- **Store the password, not the derived key.** The PBKDF2 salt currently
  lives per-envelope. If the web app re-encrypts with a fresh salt, or the
  iteration count is raised as recommended below, a cached derived key
  silently stops working. Wrap the password with a Keystore-held AES key and
  re-derive on use.
- **Decide on `setUserAuthenticationRequired`.** With it, the key is
  unavailable before first unlock after boot, so the -1 panel cannot render
  from synced data at that point. Without it, the password is recoverable by
  anything that can run as the app. Direct-boot behaviour needs a stated
  answer either way.

Before the second implementation exists:

- write the envelope format down as a specification,
- put the KDF parameters *inside* the envelope so they can change later
  without breaking stored data,
- raise the iteration count, with a migration path for existing data,
- add cross-language test vectors to CI.

Getting this wrong later means configuration that decrypts on one platform and
not the other, with no good recovery.

## 4. Authentication: per-device tokens

`LocalStorageStorage` authorizes by API key scoped to a set of `Origin`
domains. The key is already public — it sits in the web bundle in
`utils/store.js` — and the origin check is what makes that tolerable today.
An Android app sends no `Origin` at all.

**Decision:** per-device tokens. Origin headers are trivially forged outside a
browser, so the origin check was never real security; the encryption is what
protects the content, and the API key is not a secret.

Consequences:

- **An issuance flow is needed.** The repository already has `qrcode.react`
  and a `/setup` page — a QR code generated by the web app and scanned by the
  phone is the natural fit and reuses existing pieces.
- **Tokens must be listable and revocable**, which means per-identifier state
  on the backend beyond the blob itself. Storage today is flat files under
  `database/`. This forces the §9 modernisation to include a real datastore.
- **Scope tokens to a single identifier.** A stolen token then reads one
  document rather than acting as a global key — an improvement on the current
  model, not just parity.
- Device identity and revocation were missing regardless of the launcher.
  This closes that gap too.

## 5. Environment modes: time schedules plus manual override

Two things stay separate:

- **The rules** — what defines "Work". Synced; identical on every device.
- **The currently active mode** — local per device. The phone can be in
  Travelling while the desktop is in Work. Putting the active mode in the
  synced blob would be a footgun and would turn every mode switch into a sync
  write.

**Decision for v1:** time-based schedules with manual switching and override.
Rules are evaluated top-down, first match wins. No location rules.

Consequences:

- **No background location permission in v1.** This removes most of §12's
  Play Store review and privacy exposure. Location rules, if they ever
  arrive, should be geofence-based and strictly optional.
- **"If nothing matches, keep the last mode" makes resolution stateful.** The
  active mode then depends on history rather than the current time: there is
  no defined answer for a fresh install, or for a device that was powered off
  across a boundary, and the resolver is not a pure function that can be
  unit-tested. Recommended fix: require the rule list to end with a catch-all
  that always matches. Resolution becomes total and pure, and "last mode"
  reduces to "a manual override persists until the next boundary".
- **Transitions should be evaluated lazily on wake**, not driven by timers.
  With time-only rules the result is deterministic, so there is nothing to
  debounce.

> **Open point:** does a manual override survive the next schedule boundary?
> Recommendation: no. Expiring at the boundary is predictable and cannot
> strand someone in Vacation. An override with no exit is the failure mode
> users actually hit.

## 6. Visibility axes and the settings UI

`components/Module.jsx` already implements `hiddenOnDevices` with
mobile/tablet/desktop BEM modifiers.

**Decision:** launcher visibility lives on the same axis — "launcher" is a
fourth device — rather than becoming a third independent axis.

Consequences:

- **No schema change beyond one more value** in the existing `hiddenOn` list.
- **A semantic mismatch to accept deliberately.** Device visibility is
  opt-*out*: modules are shown unless hidden. So every module is
  launcher-visible by default, while the launcher can natively render almost
  none of them (§7). Resolution: keep opt-out for consistency, and have the
  launcher silently ignore module types it does not implement. The
  alternative — the web app knowing which types the launcher supports — is
  another versioned cross-implementation contract, and not worth it.
- Environments remain a separate selector from the device axis.

The UI problem is unchanged. Inline checkboxes per module do not scale:
setting up "Work" would mean opening twelve modules one at a time, with no way
to see the result. Suggested shape:

- a compact per-module visibility control for the single-module case,
- a **global matrix view** (modules × environments, plus device columns) as
  the primary surface for setting up a mode,
- everything visible everywhere by default, so users who do not care never
  encounter any of it.

## 7. The launcher panel: a native feed reader, not the portal

**Decision:** the launcher does not render portalific modules. The -1 panel is
a native feed reader over all activated RSS modules. Mobile has different UI
requirements, so this is a custom implementation per supported module type.
Some other module types may follow (TODO is the likely candidate); most will
never be supported.

This is the "native Kotlin" option, scoped down to make it affordable. What
follows from it:

- **Feed read state becomes shared, high-churn state — and this is the
  largest new requirement in this pass.** If an article read on the phone
  should show as read on the web, per-item state has to sync. It cannot live
  in the synced JSON blob: that document is MVCC'd by revision, so every
  article scrolled past becomes a full-document write with a conflict window.
  Either it gets its own endpoint with append/merge semantics, or read state
  is explicitly per-device and never syncs. This needs deciding before the
  panel is built, because it shapes both the backend and the panel's data
  model.
- **The launcher fetches and parses feeds itself.** No CORS on Android, so it
  goes direct rather than through the allow-proxy. That means a second fetch
  path, and any per-feed credentials must be usable natively.
- **The panel must render instantly on swipe.** A spinner on a launcher
  gesture is unacceptable, so the app needs its own local cache (Room) filled
  by a background worker (WorkManager), not a fetch on open.
- **Externally hosted modules stay web-only.** The README's registry idea is
  unaffected but simply has no launcher counterpart.
- The web app's own "improved offline support" idea remains independent —
  the launcher's cache does not serve it.

> **Open point:** does feed read state sync, or is it per-device? Everything
> else in this section is settled.

## 8. Per-environment icon layouts

Launcher3 stores the workspace in its own SQLite `favorites` table with its
own backup and restore path, and is not designed for swappable layouts.

**Decision:** add an environment column to that table. Some icons (Phone,
messaging) are cross-environment and must stay pinned at the same position in
every environment — people hate when things move. No Android work profile
integration: it is disproportionate effort and behaves oddly in most
organisations.

Consequences, in rough order of nastiness:

- **Pinned items are stored once**, as a row with a null environment meaning
  "all", not duplicated per environment. Duplicating desyncs the moment one
  copy is edited.
- **Grid placement is constrained.** A pinned cell must be reserved in *every*
  environment layout, so per-environment layouts cannot place freely — the
  placement and reflow logic has to treat pinned cells as occupied everywhere,
  including during drag and during grid-size changes.
- **The hotseat lives in the same table** and is probably entirely
  cross-environment.
- **Folders and their contents** need the same pinned/per-environment
  treatment, including the case of a folder pinned across environments whose
  contents differ.
- **Applications uninstalled while another environment was active** must be
  cleaned from every layout, not just the current one.
- **Widgets hold host IDs** and cannot simply be duplicated across layouts.
- **Backup/restore and the Android transfer flow** need to understand the new
  column, or they will silently flatten environments.

Still likely the hardest technical piece of the plan — harder than the feed
panel. Consider shipping the launcher with the feed panel only and adding
per-environment layouts as a second release.

## 9. Backend modernisation

`composer.json` pins `php: 7.4` and depends on **Silex**, end-of-life since
2018.

**Decision:** modernise.

Scope, given the backend is three source files plus flat-file storage:

- PHP 8.3+, and a small router — Slim, or nothing at all. Symfony is
  disproportionate here.
- **SQLite instead of flat files**, forced by the token storage in §4.
- Blob size limits and basic rate limiting, neither of which exists.
- **Close the open proxy.** `GET /proxy/{project}/{url}` fetches an arbitrary
  URL, gated only by a public API key; per §4 the origin check is not real
  protection. It will happily fetch `127.0.0.1` and cloud metadata endpoints
  from wherever it is hosted. Add private-range and link-local blocking,
  redirect-following limits, a response size cap and a timeout. This is worth
  doing independently of everything else in this document.

## 10. Monorepo mechanics

No single tool spans JavaScript, PHP and Gradle. Expect yarn workspaces,
composer and gradle side by side, with a CI matrix rather than one pipeline.

- **History.** Merge `LocalStorageStorage` with `git subtree add` (or a merge
  with `--allow-unrelated-histories`) so its history survives.
- **Independent release cadence.** The frontend deploys by rsync, the backend
  by its own path, the app through F-Droid or Play. Versioning them together
  would be a mistake — the app cannot be force-updated in step with the web
  app, which is exactly why §2 matters.
- **Contract tests** spanning packages: shared fixtures for the config schema
  and crypto test vectors, run against both the JS and Kotlin
  implementations. This is what actually keeps a polyglot monorepo honest.
- **Per-package licensing**, per §1.

Proposed layout, for discussion:

```
packages/
  web/        — this application
  backend/    — LocalStorageStorage
  schema/     — config schema, migrations, shared fixtures, crypto vectors
  launcher/   — Android
docs/
```

> **Open point:** is `schema/` a real package or just a fixtures directory
> with a written spec? Recommendation: the latter. A published package only
> pays off if the JS side consumes generated code, and the Kotlin side will
> not consume it either way — the launcher reimplements the modules natively
> (§7), so what is shared is the *document* format and the fixtures proving
> both sides agree on it.

## 11. Sequencing

Three products. The Android work should start against a configuration format
that has stopped moving.

1. **Environment modes in the web app only.** Schedules, top-down resolution,
   the matrix UI. Learn what the model should be.
2. **Monorepo merge**, plus schema versioning and the preserve-unknowns rule,
   the crypto specification, the backend modernisation and per-device tokens.
   Mostly mechanical once step 1 has settled the shape.
3. **Launcher.** Launcher3 standalone port first — it is a prerequisite and
   not a small one — then the feed panel, then per-environment icon layouts.

The proxy hardening in §9 is independent and can happen at any time.

## 12. The privacy claim changes

The README says the application "works (almost) entirely browser-based, so
your data is safe and secure". That stops being true once a launcher performs
background synchronisation.

With time-only rules in v1 there is no location permission, which removes most
of the exposure. What remains: an updated README framing, and — if it ships to
the Play Store — a data safety declaration plus justification for
`QUERY_ALL_PACKAGES` and the default launcher role. F-Droid avoids most of
that but wants reproducible builds and no proprietary dependencies.

## Open points

1. Does a manual mode override survive the next schedule boundary? (§5)
2. Does feed read state sync between phone and web, or stay per-device? (§7)
3. Is `schema/` a package or a fixtures directory? (§10)
4. Does the Keystore-held password require device unlock
   (`setUserAuthenticationRequired`), and what should the panel show before
   first unlock? (§3)
