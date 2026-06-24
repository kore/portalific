import { useState } from 'react'
import {
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline'
import { QRCodeSVG } from 'qrcode.react'
import Switch from '../Switch'
import useStore from '../../utils/store'
import { useShallow } from 'zustand/react/shallow'

export default function Settings () {
  const [settings, setSettings] = useStore(useShallow((store) => [store.settings, store.setSettings]))
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [includePassword, setIncludePassword] = useState(false)

  const setSetting = (setting, value) => {
    setCopied(false)
    setSettings({
      ...settings,
      [setting]: value
    })
  }

  const setupLink =
    `${window.location.origin}/#/setup?identifier=${settings.identifier}` +
    (includePassword ? `&password=${settings.password}` : '')

  return (
    <section className='settings-section' data-border>
      <header className='settings-header'>
        <h2>Synchronization</h2>
        <p className='settings-description'>
          Enable synchronization with a backend to enable cross-device
          synchronization.
        </p>
      </header>

      <ul className='toggle-list'>
        <Switch
          label='Enable synchronization'
          description='Once enabled we will transfer your encrypted configuration to a storage backend. You can then connect additional devices which will use the same configuration.'
          checked={settings.synchronize}
          onChange={(value) => setSettings({
            ...settings,
            synchronize: !!value,
            identifier: !value ? null : (settings.identifier || (Math.random() + 1).toString(36).substring(2)),
            password: !value ? null : settings.password
          })}
        />
      </ul>

      <div className='sync-panel' data-disabled={!settings.synchronize || undefined}>
        <div className='sync-form'>
          <label htmlFor='identifier'>Identifier</label>
          <input
            type='text'
            name='identifier'
            id='identifier'
            value={settings.identifier ?? ''}
            disabled
          />
          <label htmlFor='password' data-spaced>
            Password{' '}
            {includePassword ? ' (included in link)' : ' (not in link)'}
          </label>
          <div className='input-group'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              id='password'
              disabled={!settings.synchronize}
              value={settings.password ?? ''}
              onChange={(event) => setSetting('password', event.target.value)}
            />

            <button
              type='button'
              className='input-button'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword
                ? <EyeIcon aria-hidden='true' />
                : <EyeSlashIcon aria-hidden='true' />}
            </button>
          </div>
        </div>

        {settings.synchronize && (
          <div className='sync-qr'>
            <QRCodeSVG
              width='128'
              height='128'
              className='qr-code'
              value={setupLink}
            />
            <div className='button-group'>
              <button
                type='button'
                aria-label='Include password in link'
                onClick={() => {
                  setIncludePassword(!includePassword)
                  setCopied(false)
                }}
              >
                {includePassword
                  ? <LockOpenIcon aria-hidden='true' />
                  : <LockClosedIcon aria-hidden='true' />}
              </button>
              <button
                type='button'
                aria-label='Copy setup link'
                onClick={() => {
                  navigator.clipboard.writeText(setupLink).then(() => setCopied(true))
                }}
              >
                {copied
                  ? <ClipboardDocumentCheckIcon aria-hidden='true' />
                  : <ClipboardDocumentIcon aria-hidden='true' />}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
