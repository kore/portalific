import { useEffect } from 'react'
import useStore from '../utils/store'
import { useShallow } from 'zustand/react/shallow'

export default function Layout ({ children }) {
  const [settings, themeVariant, setThemeVariant] = useStore(useShallow((store) => [store.settings, store.themeVariant, store.setThemeVariant]))

  // Dark mode is a document-level variant so it also reaches portalled content
  // like the settings dialog and the charts reading theme variables off :root.
  useEffect(() => {
    const root = document.documentElement
    if (themeVariant === 'dark') {
      root.setAttribute('data-variant', 'dark')
    } else if (themeVariant === 'light') {
      root.removeAttribute('data-variant')
    }
  }, [themeVariant])

  // The named theme (default/black/green) is applied as a document attribute.
  useEffect(() => {
    const root = document.documentElement
    if (settings?.theme && settings.theme !== 'default') {
      root.setAttribute('data-theme', settings.theme)
    } else {
      root.removeAttribute('data-theme')
    }
  }, [settings?.theme])

  useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

    darkQuery.onchange = (e) => {
      if (e.matches) {
        document.documentElement.setAttribute('data-variant', 'dark')
        setThemeVariant('dark')
      } else {
        document.documentElement.removeAttribute('data-variant')
        setThemeVariant('light')
      }
    }
  }, [])

  return (
    <div
      className='layout theme-transition'
      style={{
        backgroundColor: settings?.backgroundColor || null,
        backgroundImage: settings?.backgroundImage
          ? `url(${settings.backgroundImage})`
          : null
      }}
    >
      <div className='layout-content'>{children}</div>
      {!settings?.backgroundColor && !settings?.backgroundImage && (
        <>
          <div className='layout-gradient' data-size='large' />
          <div className='layout-gradient' data-size='small' />
        </>
      )}
    </div>
  )
}
