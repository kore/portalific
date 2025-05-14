import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axios from 'axios'
import debounce from 'debounce'

const API_URL = 'https://local-storage-storage.io/api/portalific/'
const API_KEY = 'Bearer dslafki92esakflu8qfasdf'

const store = (set, get) => ({
  // Synchronized state
  settings: { columns: 1 },
  theme: 'auto',
  modules: [[{ type: 'welcome', id: 'welcome' }]],

  // Local app state
  errors: [],
  revision: null,

  setModules: (modules) => set({ modules }),
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

    set({ settings, modules })
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

    set({ modules })
  },

  load: async () => {
    const settings = get().settings

    if (!settings.synchronize) {
      return
    }

    axios
      .get(
        `${API_URL}${settings.identifier}`,
        {
          headers: { Authorization: API_KEY }
        }
      )
      .then((response) => {
        const data = JSON.parse(response.data.data)
        set({
          settings: data.settings,
          modules: data.modules,
          theme: data.theme,
          revision: response.data.revision
        })
      })
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

export const storeToServer = (store) => {
  if (!store.settings.synchronize) {
    return
  }

  if (!store.revision) {
    // Try to create storage, first time…
    axios
      .put(
        `${API_URL}${store.settings.identifier}`,
        // @TODO: Encrypt data with settings.password
        JSON.stringify({
          modules: store.modules,
          settings: store.settings,
          theme: store.theme
        }),
        {
          headers: { Authorization: API_KEY }
        }
      )
      .then((response) => {
        store.setRevision(response.data.revision)
      })
      .catch(
        (error) => {
          if (error.response.status === 409) {
            // store.load()
          }
        }
      )
  } else {
    // Update existing storage
    axios
      .post(
        `${API_URL}${store.settings.identifier}?revision=${store.revision}`,
        // @TODO: Encrypt data with settings.password
        JSON.stringify({
          modules: store.modules,
          settings: store.settings,
          theme: store.theme
        }),
        {
          headers: { Authorization: API_KEY }
        }
      )
      .then((response) => {
        store.setRevision(response.data.revision)
      })
      .catch(
        (error) => {
          if (error.response.status === 409) {
            // store.load()
          }
        }
      )
  }
}

// Listen for all store changes to store them on the remote server
useStore.subscribe(debounce(storeToServer, 1000))

export default useStore

// Special store without persistence for tests:
export const useTestStore = create(store)
