import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDebouncedCallback } from 'use-debounce'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Layout from '../components/Layout'
import Modules from '../components/Modules'
import Seo from '../components/Seo'

export default function Index () {
  const globalData = {
    name: 'Portalific',
    description: 'Offline-first, privacy-focussed, open-source personal portal'
  }

  const [revision, setRevision] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [errors, setErrors] = useState([])
  const [settings, setSettingsState] = useState({ columns: 1 })
  const [modules, setModulesState] = useState([
    [{ type: 'welcome', id: 'welcome' }]
  ])
  const hasWindow = typeof window !== 'undefined'
  const hasLocalStorage = hasWindow && (typeof window.localStorage !== 'undefined')

  useEffect(() => {
    if (!settings.synchronize) {
      return
    }

    axios
      .get(
        `https://local-storage-storage.io/api/portalific/${settings.identifier}`,
        {
          headers: { Authorization: 'Bearer dslafki92esakflu8qfasdf' }
        }
      )
      .then((response) => {
        const data = JSON.parse(response.data.data)
        setRevision(response.data.revision)
        setModulesState(data.modules)
        setSettingsState(data.settings)
      })

    // We only want to run his effect once, actualy, when the localStorage is
    // available. We only read loaded, settings, and modules but don't care if
    // they (also) changed:
  }, [settings.synchronize])

  useEffect(() => {
    // Update configuration from server, once the window gets focus
    if (!hasWindow || !settings.synchronize) {
      return
    }

    window.addEventListener('focus', () => {
      axios
        .get(
          `https://local-storage-storage.io/api/portalific/${settings.identifier}`,
          {
            headers: { Authorization: 'Bearer dslafki92esakflu8qfasdf' }
          }
        )
        .then((response) => {
          const data = JSON.parse(response.data.data)
          setRevision(response.data.revision)
          setModulesState(data.modules)
          setSettingsState(data.settings)
        })

      return () => {
        window.removeEventListener('focus')
      }
    })
    // We only want to run his effect once, actualy, when the window is
    // available. We only read loaded, settings, and modules but don't care if
    // they (also) changed:
  }, [hasWindow])

  const debouncedLocalStorageToServer = useDebouncedCallback(
    (settings, revision) => {
      if (!settings.synchronize) {
        setRevision(null)
        return
      }

      if (!revision) {
        axios
          .put(
            `https://local-storage-storage.io/api/portalific/${settings.identifier}`,
            // @TODO: Encrypt data with settings.password
            JSON.stringify({
              modules: JSON.parse(window.localStorage.getItem('modules')),
              settings: JSON.parse(window.localStorage.getItem('settings')),
              theme: window.localStorage.getItem('theme')
            }),
            {
              headers: { Authorization: 'Bearer dslafki92esakflu8qfasdf' }
            }
          )
          .then((response) => {
            setRevision(response.data.revision)
          })
      } else {
        axios
          .post(
            `https://local-storage-storage.io/api/portalific/${settings.identifier}?revision=${revision}`,
            // @TODO: Encrypt data with settings.password
            JSON.stringify({
              modules: JSON.parse(window.localStorage.getItem('modules')),
              settings: JSON.parse(window.localStorage.getItem('settings')),
              theme: window.localStorage.getItem('theme')
            }),
            {
              headers: { Authorization: 'Bearer dslafki92esakflu8qfasdf' }
            }
          )
          .then((response) => {
            setRevision(response.data.revision)
          })
        // @TODO: Handle 409 (Conflict)
      }
    },
    1000
  )

  const debouncedModulesToLocalStorage = useDebouncedCallback((modules) => {
    window.localStorage.setItem('modules', JSON.stringify(modules))
    debouncedLocalStorageToServer(settings, revision)
  }, 1000)

  const setModules = (modules) => {
    setModulesState(modules)
    debouncedModulesToLocalStorage(modules)
  }

  const debouncedSettingsLocalStorage = useDebouncedCallback((settings) => {
    window.localStorage.setItem('settings', JSON.stringify(settings))
    debouncedLocalStorageToServer(settings, revision)
  }, 1000)

  const setSettings = (newSettings) => {
    // If the number of columns is reduced map all modules to the still
    // available columns
    if (newSettings.columns < settings.columns) {
      for (
        let column = newSettings.columns;
        column < settings.columns;
        column++
      ) {
        modules[newSettings.columns - 1] = (
          modules[newSettings.columns - 1] || []
        )
          .concat(modules[column])
          .filter((item) => !!item)
        modules[column] = []
      }

      setModules(modules)
    }

    setSettingsState(newSettings)
    debouncedSettingsLocalStorage(newSettings)
  }

  const pushError = (error, errorInfo = null) => {
    setErrors([...errors, { error, info: errorInfo }])
  }

  useEffect(() => {
    if (hasLocalStorage && !loaded) {
      setSettingsState(
        JSON.parse(window.localStorage.getItem('settings')) || settings
      )
      setModulesState(JSON.parse(window.localStorage.getItem('modules')) || modules)
      setLoaded(true)
    }

    // We only want to run his effect once, actualy, when the localStorage is
    // available. We only read loaded, settings, and modules but don't care if
    // they (also) changed:
  }, [hasLocalStorage])

  return (
    <Layout settings={settings}>
      <Seo title={globalData.name} description={globalData.description} />
      <Header
        name={globalData.name}
        modules={modules}
        setModules={setModules}
        settings={settings}
        setSettings={setSettings}
        errors={errors}
        clearErrors={() => setErrors([])}
      />
      <main>
        <Modules
          pushError={pushError}
          setSettings={setSettings}
          settings={settings}
          modules={modules}
          setModules={setModules}
        />
      </main>
      <Footer copyrightText={globalData.footerText} />
    </Layout>
  )
}

export function getStaticProps () {
  return { props: {} }
}
