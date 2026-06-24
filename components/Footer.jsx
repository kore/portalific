import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon, ClockIcon } from '@heroicons/react/24/outline'
import useStore from '../utils/store'
import { useShallow } from 'zustand/react/shallow'

const ThemeSwitcher = () => {
  const [auto, setAuto] = useState(true)
  const [themeVariant, setThemeVariant] = useStore(useShallow((store) => [store.themeVariant, store.setThemeVariant]))

  const setAutoTheme = (auto) => {
    if (typeof document === 'undefined' || !auto) {
      return
    }

    const hours = new Date().getHours()
    if (hours > 6 && hours < 20) {
      document.documentElement.removeAttribute('data-variant')
    } else {
      document.documentElement.setAttribute('data-variant', 'dark')
    }
  }

  useEffect(() => {
    setAuto(themeVariant === 'auto')
    setAutoTheme(auto)

    const interval = setInterval(() => {}, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [auto])

  return (
    <nav className='theme-switcher' aria-label='Theme'>
      <button
        type='button'
        data-mode='dark'
        aria-label='Use Dark Mode'
        aria-pressed={themeVariant === 'dark'}
        onClick={() => {
          setThemeVariant('dark')
          setAuto(false)
        }}
      >
        <MoonIcon aria-hidden='true' />
      </button>

      <button
        type='button'
        data-mode='light'
        aria-label='Use Light Mode'
        aria-pressed={themeVariant === 'light'}
        onClick={() => {
          setThemeVariant('light')
          setAuto(false)
        }}
      >
        <SunIcon aria-hidden='true' />
      </button>

      <button
        type='button'
        data-mode='auto'
        aria-label='Use Auto Mode'
        aria-pressed={auto}
        onClick={() => {
          setThemeVariant('auto')
          setAuto(true)
        }}
      >
        <ClockIcon aria-hidden='true' />
      </button>
    </nav>
  )
}

export default function Footer () {
  return (
    <footer className='footer'>
      <p className='footer-copyright'>
        <a
          target='_blank'
          href='https://interoperable-europe.ec.europa.eu/collection/eupl/eupl-text-eupl-12'
          rel='noreferrer'
        >
          EUPL
        </a>{' '}
        by{' '}
        <a
          target='_blank'
          href='https://kore-nordmann.de/'
          rel='noreferrer'
        >
          Kore Nordmann
        </a>
      </p>
      <ThemeSwitcher />
    </footer>
  )
}
