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
      <main className='modules' data-variant='setup'>
        <div className='module'>
          <h1>Import Settings</h1>

          <section className='settings-section'>
            <div>
              <label htmlFor='identifier' className='sr-only'>
                Identifier
              </label>
              <input
                id='identifier'
                name='identifier'
                type='text'
                disabled
                value={identifier || 'Missing identifier'}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <div className='input-group'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
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

            <button
              type='submit'
              className='button'
              data-variant='primary'
              onClick={startImport}
            >
              Start Import
            </button>
          </section>

          <ul className='error-list' data-variant='import'>
            {steps.map((step, i) => (
              <li key={step.message + i}>
                <div className='error-entry'>
                  <span className='error-icon'>
                    <step.icon aria-hidden='true' />
                  </span>
                  <div className='error-message'>
                    <p>{step.message}</p>
                    {Array.isArray(store.errors) && store.errors.length > 0 && store.errors.filter(
                      (error) => (error.info === step.type)
                    ).map((error) => (
                      <p className='error-meta' data-tone='error' key={error.error}>
                        {error.error}
                      </p>
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
