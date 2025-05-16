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

  const hasWindow = typeof window !== 'undefined'
  const hasLocalStorage = hasWindow && (typeof window.localStorage !== 'undefined')

  const store = useStore((store) => store)

  // This code (The useEffect callback) can be removed by 2025-07-01
  //
  // It is used to migrate old localStorage items into the Zustand store, which
  // also stores these items in localStorage, but in a "portalific" property.
  useEffect(() => {
    let legacySettings = window.localStorage.getItem('settings') || null
    let legacyModules = window.localStorage.getItem('modules') || null

    legacySettings = JSON.parse(legacySettings) || null
    legacyModules = JSON.parse(legacyModules) || null

    if (legacySettings && legacyModules) {
      console.info('Found legacy configuration – will migrate it: ', legacySettings, legacyModules)

      store.setSettings(legacySettings)
      store.setModules(legacyModules)

      window.localStorage.removeItem('settings')
      window.localStorage.removeItem('modules')

      console.info('Migration complete')
    }
  }, [hasLocalStorage])

  useEffect(() => {
    store.load()

    // We only want to run his effect once, actualy, when the localStorage is
    // available. We only read loaded, settings, and modules but don't care if
    // they (also) changed:
  }, [store.settings.synchronize])

  return (
    <Layout>
      <Seo title={globalData.name} description={globalData.description} />
      <Header name={globalData.name} />
      <main>
        <Modules />
      </main>
      <Footer />
    </Layout>
  )
}

export function getStaticProps () {
  return { props: {} }
}
