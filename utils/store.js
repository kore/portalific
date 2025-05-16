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
  errors: [],
  revision: null,
  synchronizedStateHasChanges: false,
  themeVariant: 'auto'
}

const store = (set, get) => ({
  ...initialState,

  reset: () => set(initialState),

  setThemeVariant: (themeVariant) => set({ themeVariant }),
  setModules: (modules) => set({ modules, synchronizedStateHasChanges: true }),
  pushError: (error, errorInfo) => set({ errors: [...get().errors, { error, info: errorInfo }] }),
  clearErrors: () => set({ errors: [] }),

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
            try {
              const decrypted = await decryptData(
                settings.password,
                data.encryptedData
              )

              // If decryption fails, reset the store
              if (!decrypted) {
                get().reset()
                get().pushError('Decryption failed, likely because of a wrong password')
                return response
              }

              // Use decrypted data
              set({
                settings: decrypted.settings,
                modules: decrypted.modules,
                revision: response.data.revision,
                errors: [],
                synchronizedStateHasChanges: false
              })
            } catch (error) {
              console.error('Cought', error)
            }
          } else {
            // No password but encrypted data - treat as error
            get().reset()
            get().pushError('Encrypted data received but no password set')
          }
        } else {
          // Data is not encrypted, parse it normally
          set({
            settings: data.settings,
            modules: data.modules,
            revision: response.data.revision,
            synchronizedStateHasChanges: false
          })
        }
        return response // Return the response for chaining
      })
      .catch(
        async (error) => {
          if (error.response && error.response.status === 404) {
            set({ revision: null })
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
    if (get().settings.password) {
      const encrypted = await encryptData(get().settings.password, dataToSync)
      finalData = JSON.stringify(encrypted)
    } else {
      finalData = JSON.stringify(dataToSync)
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
      storage: createJSONStorage(() => window.localStorage)
    }
  )
)

export const storeToServer = (store) => store.persist()

// Listen for all store changes to store them on the remote server
useStore.subscribe(debounce(storeToServer, 1000))

export default useStore

// Special store without persistence for tests:
export const useTestStore = create(store)
