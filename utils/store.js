import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axios from 'axios'
import debounce from 'debounce'
import { encryptData, decryptData } from '../utils/encryption'

export const API_URL = 'https://local-storage-storage.io/api/portalific/'
export const API_AUTH_HEADER = {
  Accept: 'application/json',
  Authorization: 'Bearer dslafki92esakflu8qfasdf',
  'Content-Type': 'application/json'
}

export const initialState = {
  // Synchronized state
  settings: { columns: 1 },
  modules: [[{ type: 'welcome', id: 'welcome' }]],

  // Local app state
  // Errors are kept in slots keyed by their source (feed URL, calendar URL,
  // sync operation, module id), so that a repeatedly failing source occupies
  // exactly one slot and a recovering source can free its slot again.
  errors: {},
  revision: null,
  synchronized: false,
  synchronizedStateHasChanges: false,
  themeVariant: 'auto'
}

// Filter out corrupted/undefined entries from module columns
const sanitizeModules = (modules) => {
  if (!Array.isArray(modules)) return initialState.modules
  return modules.map((column) =>
    Array.isArray(column) ? column.filter((module) => module && module.type) : []
  )
}

// Error slot prefixes which can be derived from the current module
// configuration. Slots with any other prefix (sync:… for example) have no
// counterpart in the module list and are never pruned.
const MANAGED_ERROR_PREFIXES = ['module:', 'feed:', 'calendar:']

// All error slot keys the current module configuration could produce
const activeErrorKeys = (modules) => {
  const keys = new Set()

  ;(Array.isArray(modules) ? modules : [])
    .flat()
    .filter((module) => module && module.type)
    .forEach((module) => {
      keys.add(`module:${module.id}`)
      ;(module.feeds ?? []).forEach((feed) => keys.add(`feed:${feed.feed}`))
      ;(module.calendars ?? []).forEach((calendar) =>
        keys.add(`calendar:${calendar.calendar}`)
      )
    })

  return keys
}

// Drop error slots whose source (module, feed, calendar) no longer exists –
// nothing would ever clear those again, since they are not fetched any more
const pruneErrors = (modules, errors) => {
  const active = activeErrorKeys(modules)
  const remaining = Object.fromEntries(
    Object.entries(errors).filter(
      ([key]) =>
        active.has(key) ||
        !MANAGED_ERROR_PREFIXES.some((prefix) => key.startsWith(prefix))
    )
  )

  // Keep the previous object identity if nothing was pruned, to avoid
  // re-rendering all error consumers on every configuration change
  return Object.keys(remaining).length === Object.keys(errors).length
    ? errors
    : remaining
}

const store = (set, get) => ({
  ...initialState,

  reset: () => set(initialState),

  setThemeVariant: (themeVariant) => set({ themeVariant }),
  setModules: (modules) => set({
    modules,
    errors: pruneErrors(modules, get().errors),
    synchronizedStateHasChanges: true
  }),

  setError: (key, error, errorInfo) => {
    const previous = get().errors[key]
    const now = new Date().getTime()

    set({
      errors: {
        ...get().errors,
        [key]: {
          error,
          info: errorInfo,
          count: (previous?.count ?? 0) + 1,
          firstSeen: previous?.firstSeen ?? now,
          lastSeen: now
        }
      }
    })
  },

  clearError: (key) => {
    // Do not touch the state if there is nothing to clear – this runs on every
    // successful refresh and would otherwise re-render all error consumers
    if (!(key in get().errors)) {
      return
    }

    const errors = { ...get().errors }
    delete errors[key]
    set({ errors })
  },

  clearErrors: () => set({ errors: {} }),

  setSettings: (settings) => {
    const oldSettings = get().settings
    const modules = [...get().modules]

    // If the number of columns is reduced map all modules to the still
    // available columns
    if (settings.columns < oldSettings.columns) {
      for (
        let column = settings.columns;
        column < oldSettings.columns;
        column++
      ) {
        modules[settings.columns - 1] = (
          modules[settings.columns - 1] || []
        )
          .concat(modules[column])
          .filter((item) => !!item)
        modules[column] = []
      }
    }

    set({ settings, modules, synchronizedStateHasChanges: true })
  },

  setRevision: (revision) => {
    set({ revision })
  },

  moveModule: (sourceColumn, sourceIndex, targetColumn, targetIndex) => {
    const modules = [...get().modules]

    if (!Array.isArray(modules[sourceColumn]) || !modules[sourceColumn][sourceIndex]) {
      return
    }

    const removedModule = modules[sourceColumn][sourceIndex]

    // Remove item from source column
    modules[sourceColumn].splice(sourceIndex, 1)

    // Put item into target column
    if (!Array.isArray(modules[targetColumn])) {
      modules[targetColumn] = []
    }
    modules[targetColumn].splice(targetIndex, 0, removedModule)

    set({ modules, synchronizedStateHasChanges: true })
  },

  load: async () => {
    const settings = get().settings

    if (!settings.synchronize) {
      return Promise.resolve()
    }

    // Return the axios promise chain so it can be awaited
    return axios
      .get(
        `${API_URL}${settings.identifier}`,
        { headers: API_AUTH_HEADER }
      )
      .then(async (response) => {
        const data = JSON.parse(response.data.data)

        // Check if data is encrypted
        if (data.encryptedData) {
          // If password is set, try to decrypt
          if (settings.password) {
            const decrypted = await decryptData(
              settings.password,
              data.encryptedData
            )

            // If decryption fails, reset the store
            if (!decrypted) {
              get().setError('sync:decrypting', 'Decryption failed, likely because of a wrong password', 'decrypting')
              return response
            }

            // Use decrypted data
            const modules = sanitizeModules(decrypted.modules)
            set({
              settings: decrypted.settings,
              modules,
              errors: pruneErrors(modules, get().errors),
              revision: response.data.revision,
              synchronizedStateHasChanges: false,
              synchronized: true
            })
            get().clearError('sync:decrypting')
          } else {
            // No password but encrypted data - treat as error
            get().setError('sync:decrypting', 'Encrypted data received but no password set', 'decrypting')
          }
        } else {
          // Data is not encrypted, parse it normally
          const modules = sanitizeModules(data.modules)
          set({
            settings: data.settings,
            modules,
            errors: pruneErrors(modules, get().errors),
            revision: response.data.revision,
            synchronizedStateHasChanges: false,
            synchronized: true
          })
          get().clearError('sync:decrypting')
        }

        get().clearError('sync:loading')
        return response // Return the response for chaining
      })
      .catch(
        async (error) => {
          if (error.response && error.response.status === 404) {
            get().setError('sync:loading', 'No storage found with provided ID', 'loading')
            return Promise.resolve()
          }

          throw error // Re-throw the error for further handling
        }
      )
  },

  persist: async () => {
    if (!get().settings.synchronize) {
      return Promise.resolve()
    }

    if (!get().synchronizedStateHasChanges) {
      return Promise.resolve()
    }

    const dataToSync = {
      modules: get().modules,
      settings: get().settings
    }

    // Encrypt data if password is set
    let finalData
    try {
      if (get().settings.password) {
        const encrypted = await encryptData(get().settings.password, dataToSync)
        finalData = JSON.stringify(encrypted)
      } else {
        finalData = JSON.stringify(dataToSync)
      }
    } catch (error) {
      get().setError('sync:persisting', 'Failed to prepare data for sync: ' + error.message, 'persisting')
      return Promise.resolve()
    }

    // Validate that we have actual data to sync - prevents writing empty files
    if (!finalData || finalData === '{}' || finalData === '""' || finalData.length < 10) {
      get().setError('sync:persisting', 'Sync aborted: data appears to be empty or corrupted', 'persisting')
      return Promise.resolve()
    }

    if (!get().revision) {
      // Try to create storage, first time…
      return axios
        .put(
          `${API_URL}${get().settings.identifier}`,
          finalData,
          { headers: API_AUTH_HEADER }
        )
        .then((response) => {
          set({ revision: response.data.revision, synchronizedStateHasChanges: false })
          get().clearError('sync:persisting')
          return response // Return the response for chaining
        })
        .catch(
          async (error) => {
            if (error.response && error.response.status === 409) {
              return get().load()
            }

            throw error // Re-throw the error for further handling
          }
        )
    } else {
      // Update existing storage
      return axios
        .post(
          `${API_URL}${get().settings.identifier}?revision=${get().revision}`,
          finalData,
          { headers: API_AUTH_HEADER }
        )
        .then((response) => {
          set({ revision: response.data.revision, synchronizedStateHasChanges: false })
          get().clearError('sync:persisting')
          return response // Return the response for chaining
        })
        .catch(
          async (error) => {
            if (error.response && error.response.status === 409) {
              return get().load()
            }

            // For 404 errors, disable synchronization
            if (error.response && error.response.status === 404) {
              set({
                settings: {
                  ...get().settings,
                  synchronize: false,
                  identifier: null,
                  password: null
                }
              })
              return Promise.resolve()
            }

            throw error // Re-throw the error for further handling
          }
        )
    }
  }
})

const useStore = create(
  persist(
    store,
    {
      name: 'portalific',
      storage: createJSONStorage(() => window.localStorage),
      // Error slots are derived from live state – they must not be restored
      partialize: ({ errors, ...state }) => state,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        // Drop error lists persisted by earlier versions
        errors: {}
      })
    }
  )
)

export const storeToServer = (store) => store.persist()

// Listen for all store changes to store them on the remote server
useStore.subscribe(debounce(storeToServer, 1000))

export default useStore

// Special store without persistence for tests:
export const useTestStore = create(store)
