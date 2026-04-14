import { useState, useEffect } from 'react'
import {
  EyeIcon,
  EyeSlashIcon,
  CloudArrowDownIcon,
  LockOpenIcon,
  ArrowDownTrayIcon,
  ArrowRightCircleIcon
} from '@heroicons/react/24/outline'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Layout from '../components/Layout'

import useStore from '../utils/store'

function getHashParams () {
  const hashQuery = window.location.hash.split('?')[1] || ''
  return new URLSearchParams(hashQuery)
}

export default function Setup () {
  const store = useStore((store) => store)

  const params = getHashParams()
  const [password, setPassword] = useState(params.get('password') || '')
  const [showPassword, setShowPassword] = useState(false)
  const identifier = params.get('identifier') || ''

  const steps = [
    {
      icon: CloudArrowDownIcon,
      completed: false,
      message: 'Loading data',
      type: 'loading'
    },
    {
      icon: LockOpenIcon,
      completed: false,
      message: 'Decrpyting data',
      type: 'decrypting'
    },
    {
      icon: ArrowDownTrayIcon,
      completed: false,
      message: 'Storing settings locally',
      type: 'importing'
    },
    {
      icon: ArrowRightCircleIcon,
      completed: false,
      message: 'Go to portal…',
      type: 'leaving'
    }
  ]

  const startImport = async () => {
    await store.reset()
    await store.setSettings({
      identifier,
      synchronize: true,
      password
    })
    await store.load()
  }

  useEffect(() => {
    if (store.synchronized) {
      window.location.hash = '#/'
    }
  }, [store.synchronized])

  return (
    <Layout>
      <Header name='Portalific' />
      <main className='modules modules--setup'>
        <div className='module'>
          <h1 className='typography__heading typography__heading--1'>
            Import Settings
          </h1>

          <div className='settings__form'>
            <div className='settings__input-group'>
              <div>
                <label htmlFor='identifier' className='sr-only'>
                  Identifier
                </label>
                <input
                  id='identifier'
                  name='identifier'
                  type='text'
                  disabled
                  className='settings__input'
                  value={identifier || 'Missing identifier'}
                />
              </div>
              <div>
                <label htmlFor='password' className='sr-only'>
                  Password
                </label>
                <div className='settings__input-group'>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    className='settings__input'
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                    }}
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
            </div>

            <div>
              <button
                type='submit'
                className='button button--primary'
                onClick={startImport}
              >
                Start Import
              </button>
            </div>
          </div>

          <ul role='list' className='error-list error-list--import'>
            {steps.map((step, i) => (
              <li className='error-list__item' key={step.message + i}>
                <div className='error-list__content'>
                  <div className='error-list__icon-container'>
                    <step.icon
                      className='error-list__icon'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='error-list__message'>
                    <p>{step.message}</p>
                    {Array.isArray(store.errors) && store.errors.length > 0 && store.errors.filter(
                      (error) => (error.info === step.type)
                    ).map((error) => (
                      <div className='error-list__message-error' key={error.error}>
                        {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </Layout>
  )
}
