import { useState } from 'react'
import { Switch } from '@headlessui/react'
import {
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline'
import { QRCodeSVG } from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default function Settings ({ settings, setSettings }) {
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [includePassword, setIncludePassword] = useState(false)

  const setSetting = (setting, value) => {
    if (setting === 'synchronize' && value) {
      settings.identifier =
        settings.identifier || (Math.random() + 1).toString(36).substring(2)
    }

    setCopied(false)
    setSettings({
      ...settings,
      [setting]: value
    })
  }

  const setupLink =
    `${window.location.host}/setup?identifier=${settings.identifier}` +
    (includePassword ? `&password=${settings.password}` : '')

  return (
    <div className='settings__section settings__section--border'>
      <div className='settings__content'>
        <div className='settings__header'>
          <h2 className='settings__heading'>Synchronization</h2>
          <p className='settings__description'>
            Enable synchronization with a backend to enable cross-device
            synchronization.
          </p>
        </div>

        <ul className='settings__toggle-list'>
          <Switch.Group as='li' className='settings__toggle-item'>
            <div className='settings__toggle-content'>
              <Switch.Label as='p' className='settings__toggle-label' passive>
                Enable synchronization
              </Switch.Label>
              <Switch.Description className='settings__toggle-description'>
                Once enabled we will transfer your encrypted configuration to a
                storage backend. You can then connect additional devices which
                will use the same configuration.
              </Switch.Description>
            </div>
            <Switch
              checked={settings.synchronize}
              onChange={(value) => setSetting('synchronize', value)}
              className={`settings__switch ${
                settings.synchronize ? 'settings__switch--active' : ''
              }`}
            >
              <span
                aria-hidden='true'
                className={`settings__switch-handle ${
                  settings.synchronize ? 'settings__switch-handle--active' : ''
                }`}
              />
            </Switch>
          </Switch.Group>
        </ul>

        <div
          className={`settings__sync-panel ${
            !settings.synchronize ? 'settings__sync-panel--disabled' : ''
          }`}
        >
          <div className='settings__sync-form'>
            <label htmlFor='identifier' className='settings__label'>
              Identifier
            </label>
            <input
              type='text'
              name='identifier'
              id='identifier'
              value={settings.identifier ?? ''}
              disabled
              className='settings__input'
            />
            <label
              htmlFor='password'
              className='settings__label settings__label--spaced'
            >
              Password{' '}
              {includePassword ? ' (included in link)' : ' (not in link)'}
            </label>
            <div className='settings__input-group'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                id='password'
                disabled={!settings.synchronize}
                value={settings.password ?? ''}
                onChange={(event) => setSetting('password', event.target.value)}
                className='settings__input'
              />

              <button
                onClick={() => setShowPassword(!showPassword)}
                className='settings__input-button'
              >
                {showPassword
                  ? (
                    <EyeIcon
                      className='settings__input-icon'
                      aria-hidden='true'
                    />
                    )
                  : (
                    <EyeSlashIcon
                      className='settings__input-icon'
                      aria-hidden='true'
                    />
                    )}
              </button>
            </div>
          </div>

          {settings.synchronize && (
            <div className='settings__sync-qr'>
              <QRCodeSVG
                width='128'
                height='128'
                className='settings__qr-code'
                value={setupLink}
              />
              <div className='settings__button-group'>
                <button
                  type='button'
                  onClick={() => {
                    setIncludePassword(!includePassword)
                    setCopied(false)
                  }}
                  className='settings__button-group-item settings__button-group-item--left'
                >
                  {includePassword
                    ? (
                      <LockOpenIcon
                        className='settings__button-icon'
                        aria-hidden='true'
                        title='Include password in link'
                      />
                      )
                    : (
                      <LockClosedIcon
                        className='settings__button-icon'
                        aria-hidden='true'
                        title='Include password in link'
                      />
                      )}
                </button>
                <CopyToClipboard
                  text={setupLink}
                  onCopy={() => setCopied(true)}
                >
                  <button
                    type='button'
                    className='settings__button-group-item settings__button-group-item--right'
                  >
                    {copied
                      ? (
                        <ClipboardDocumentCheckIcon
                          className='settings__button-icon'
                          aria-hidden='true'
                        />
                        )
                      : (
                        <ClipboardDocumentIcon
                          className='settings__button-icon'
                          aria-hidden='true'
                        />
                        )}
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
