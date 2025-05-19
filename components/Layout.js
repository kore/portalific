import { Fragment, useEffect } from 'react'
import useStore from '../utils/store'
import { useShallow } from 'zustand/react/shallow'

export default function Layout ({ children }) {
  const [settings, themeVariant, setThemeVariant] = useStore(useShallow((store) => [store.settings, store.themeVariant, store.setThemeVariant]))

  const setAppTheme = () => {
    if (themeVariant === 'dark') {
      document.documentElement.classList.add('variant--dark')
    } else if (themeVariant === 'light') {
      document.documentElement.classList.remove('variant--dark')
    }
  }

  const handleSystemThemeChange = () => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

    darkQuery.onchange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('variant--dark')
        setThemeVariant('dark')
      } else {
        document.documentElement.classList.remove('variant--dark')
        setThemeVariant('light')
      }
    }
  }

  useEffect(() => {
    setAppTheme()
  }, [themeVariant])

  useEffect(() => {
    handleSystemThemeChange()
  }, [])

  return (
    <div
      className={`layout theme-transition theme--${settings?.theme}`}
      style={{
        backgroundColor: settings?.backgroundColor || null,
        backgroundImage: settings?.backgroundImage
          ? `url(${settings.backgroundImage})`
          : null
      }}
    >
      <div className='layout__container'>{children}</div>
      {!settings?.backgroundColor && !settings?.backgroundImage && (
        <>
          <div className='layout__gradient layout__gradient--large' />
          <div className='layout__gradient layout__gradient--small' />
        </>
      )}
    </div>
  )
}
