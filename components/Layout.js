import { Fragment, useEffect } from 'react'

export default function Layout ({ children, settings = {} }) {
  const setAppTheme = () => {
    const darkMode = window.localStorage.getItem('theme') === 'dark'
    const lightMode = window.localStorage.getItem('theme') === 'light'

    if (darkMode) {
      document.documentElement.classList.add('variant--dark')
    } else if (lightMode) {
      document.documentElement.classList.remove('variant--dark')
    }
  }

  const handleSystemThemeChange = () => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

    darkQuery.onchange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('variant--dark')
        window.localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('variant--dark')
        window.localStorage.setItem('theme', 'light')
      }
    }
  }

  useEffect(() => {
    setAppTheme()
  }, [])

  useEffect(() => {
    handleSystemThemeChange()
  }, [])

  return (
    <>
      <div
        className={`layout theme-transition theme--${settings.theme}`}
        style={{
          backgroundColor: settings.backgroundColor || null,
          backgroundImage: settings.backgroundImage
            ? `url(${settings.backgroundImage})`
            : null
        }}
      >
        <div className='layout__container'>{children}</div>
        {!settings.backgroundColor && !settings.backgroundImage && (
          <>
            <div className='layout__gradient layout__gradient--large' />
            <div className='layout__gradient layout__gradient--small' />
          </>
        )}
      </div>
    </>
  )
}
