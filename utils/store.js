import { create } from 'zustand'
import axios from 'axios'

const API_URL = 'https://local-storage-storage.io/api/portalific/'
const API_KEY = 'Bearer dslafki92esakflu8qfasdf'

const useStore = create((set, get) => ({
  settings: { columns: 1 },
  modules: [[{ type: 'welcome', id: 'welcome' }]],
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
          modules: data.settings,
          revision: response.data.revision
        })
      })
  }
}))

export default useStore
