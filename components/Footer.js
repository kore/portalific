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
      document.documentElement.classList.remove('variant--dark')
    } else {
      document.documentElement.classList.add('variant--dark')
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
    <div className='theme-switcher'>
      <button
        type='button'
        aria-label='Use Dark Mode'
        onClick={() => {
          setThemeVariant('dark')
          setAuto(false)
        }}
        className={`theme-switcher__button theme-switcher__button--dark ${
          themeVariant === 'dark' ? 'theme-switcher__button--active' : ''
        }`}
      >
        <MoonIcon className='theme-switcher__icon' aria-hidden='true' />
      </button>

      <button
        type='button'
        aria-label='Use Light Mode'
        onClick={() => {
          setThemeVariant('light')
          setAuto(false)
        }}
        className={`theme-switcher__button theme-switcher__button--light ${
          themeVariant === 'light' ? 'theme-switcher__button--active' : ''
        }`}
      >
        <SunIcon className='theme-switcher__icon' aria-hidden='true' />
      </button>

      <button
        type='button'
        aria-label='Use Auto Mode'
        onClick={() => {
          setThemeVariant('auto')
          setAuto(true)
        }}
        className={`theme-switcher__button theme-switcher__button--auto ${
          auto ? 'theme-switcher__button--active' : ''
        }`}
      >
        <ClockIcon className='theme-switcher__icon' aria-hidden='true' />
      </button>
    </div>
  )
}

export default function Footer () {
  return (
    <footer className='footer'>
      <p className='footer__copyright'>
        <a
          className='footer__link'
          target='_blank'
          href='https://github.com/kore/portalific/blob/main/LICENSE'
          rel='noreferrer'
        >
          GPLv3
        </a>{' '}
        by{' '}
        <a
          className='footer__link'
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
