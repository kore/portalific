import { useEffect } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Layout from '../components/Layout'
import Modules from '../components/Modules'
import Seo from '../components/Seo'

import useStore from '../utils/store'

export default function Index () {
  const globalData = {
    name: 'Portalific',
    description: 'Offline-first, privacy-focussed, open-source personal portal'
  }

  const store = useStore((store) => store)

  // const hasWindow = typeof window !== 'undefined'
  // const hasLocalStorage = hasWindow && (typeof window.localStorage !== 'undefined')

  /*
  useEffect(() => {
    console.log('Load')
    // store.load()

    // We only want to run his effect once, actualy, when the localStorage is
    // available. We only read loaded, settings, and modules but don't care if
    // they (also) changed:
  }, [store.settings.synchronize])
  // */

  /*
  import { useDebouncedCallback } from 'use-debounce'
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
  ) // */

  return (
    <Layout>
      <Seo title={globalData.name} description={globalData.description} />
      <Header name={globalData.name} />
      <main>
        <Modules store={store} />
      </main>
      <Footer copyrightText={globalData.footerText} />
    </Layout>
  )
}

export function getStaticProps () {
  return { props: {} }
}
