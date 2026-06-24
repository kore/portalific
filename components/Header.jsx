import { useState } from 'react'
import { Cog8ToothIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Logo from './Logo'
import Modal from './Modal'
import Settings from './Settings'
import useStore from '../utils/store'
import { useShallow } from 'zustand/react/shallow'

export default function Header ({ name }) {
  const [settings, errors, clearErrors] = useStore(useShallow((store) => [store.settings, store.errors, store.clearErrors]))
  const [showSettings, setShowSettings] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  return (
    <header className='header'>
      <Logo />
      <a href='#/' className='header-title'>
        {settings.name && settings.name + "'s "}
        {name}
      </a>
      {Array.isArray(errors) && errors.length > 0 && (
        <button
          type='button'
          className='icon-button'
          data-variant='error'
          onClick={() => setShowErrors(true)}
        >
          <span className='sr-only'>View notifications</span>
          <ExclamationTriangleIcon aria-hidden='true' />
        </button>
      )}
      <Modal open={showErrors} setOpen={setShowErrors}>
        <ul className='error-list'>
          {Array.isArray(errors) && errors.map((error, index) => (
            <li key={index}>
              <div className='error-entry'>
                <span className='error-icon'>
                  <ExclamationTriangleIcon aria-hidden='true' />
                </span>
                <div className='error-message'>
                  <p>{error.error}</p>
                  {error.info && (
                    <p className='error-meta'>{error.info}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type='button'
          className='button'
          data-variant='secondary'
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
        className='icon-button'
        data-variant='settings'
        onClick={() => setShowSettings(true)}
      >
        <span className='sr-only'>View settings</span>
        <Cog8ToothIcon aria-hidden='true' />
      </button>
      <Modal open={showSettings} setOpen={setShowSettings}>
        <Settings />
      </Modal>
    </header>
  )
}
