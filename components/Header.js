import { useState } from 'react'
import Link from 'next/link'
import {
  Cog8ToothIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Logo from './Logo'
import Modal from './Modal'
import Settings from './Settings'

export default function Header ({ name, store }) {
  const [showSettings, setShowSettings] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  return (
    <header className='header'>
      <Logo className='header__logo' />
      <Link href='/' className='header__title'>
        {store.settings.name && store.settings.name + "'s "}
        {name}
      </Link>
      {store.errors && !!store.errors.length && (
        <button
          type='button'
          className='header__button header__button--error'
          onClick={() => setShowErrors(true)}
        >
          <span className='sr-only'>View notifications</span>
          <ExclamationTriangleIcon
            className='header__icon'
            aria-hidden='true'
          />
        </button>
      )}
      <Modal settings={store.settings} open={showErrors} setOpen={setShowErrors}>
        <ul className='error-list'>
          {store.errors.map((error, index) => (
            <li key={index} className='error-list__item'>
              {index !== store.errors.length - 1
                ? (
                  <span className='error-list__separator' aria-hidden='true' />
                  )
                : null}
              <div className='error-list__content'>
                <div>
                  <span className='error-list__icon-container'>
                    <ExclamationTriangleIcon
                      className='error-list__icon'
                      aria-hidden='true'
                    />
                  </span>
                </div>
                <div className='error-list__message'>
                  <p>{error.error}</p>
                  {error.info && (
                    <div className='error-list__message-info'>{error.info}</div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type='button'
          className='button button--secondary'
          onClick={() => {
            store.clearErrors()
            setShowErrors(false)
          }}
        >
          Clear all errors
        </button>
      </Modal>
      <button
        type='button'
        className='header__button header__button--settings'
        onClick={() => setShowSettings(true)}
      >
        <span className='sr-only'>View settings</span>
        <Cog8ToothIcon className='header__icon' aria-hidden='true' />
      </button>
      <Modal settings={store.settings} open={showSettings} setOpen={setShowSettings}>
        <Settings store={store} />
      </Modal>
    </header>
  )
}
