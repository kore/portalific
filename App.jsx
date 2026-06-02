import { useState, useEffect } from 'react'
import Index from './pages/index'
import Setup from './pages/setup'

export default function App () {
  const [hash, setHash] = useState(window.location.hash || '#/')

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (hash.startsWith('#/setup')) {
    return <Setup />
  }

  return <Index />
}
