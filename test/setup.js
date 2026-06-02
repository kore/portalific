import crypto from 'crypto'

// Mirror the globals the previous Jest setup provided: a `window.crypto`
// backed by Node's crypto module. It has no `getRandomValues`, so the Web
// Crypto integration tests skip themselves exactly as they did under Jest.
globalThis.window = { crypto }
