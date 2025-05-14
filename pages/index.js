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
