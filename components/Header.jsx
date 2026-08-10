import { useState } from 'react'
import { Cog8ToothIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Logo from './Logo'
import Modal from './Modal'
import Settings from './Settings'
import useStore from '../utils/store'
import { useShallow } from 'zustand/react/shallow'

const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

export default function Header ({ name }) {
  const [settings, errors, clearErrors] = useStore(useShallow((store) => [store.settings, store.errors, store.clearErrors]))
  const [showSettings, setShowSettings] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  const errorList = Object.entries(errors ?? {})
    .map(([key, error]) => ({ key, ...error }))
    .sort((a, b) => b.lastSeen - a.lastSeen)

  return (
    <header className='header'>
      <Logo className='header__logo' />
      <a href='#/' className='header__title'>
        {settings.name && settings.name + "'s "}
        {name}
      </a>
      {errorList.length > 0 && (
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
      <Modal theme={settings.theme} open={showErrors} setOpen={setShowErrors}>
        <ul className='error-list'>
          {errorList.map((error, index) => (
            <li key={error.key} className='error-list__item'>
              {index !== errorList.length - 1
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
                  <div className='error-list__message-meta'>
                    {error.count > 1
                      ? `Failed ${error.count} times, last at ${formatTime(error.lastSeen)}`
                      : `Failed at ${formatTime(error.lastSeen)}`}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type='button'
          className='button button--secondary'
          onClick={() => {
            clearErrors()
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
      <Modal theme={settings.theme} open={showSettings} setOpen={setShowSettings}>
        <Settings />
      </Modal>
    </header>
  )
}
