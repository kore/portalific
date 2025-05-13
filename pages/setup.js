import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
import Seo from '../components/Seo'

import useStore from '../utils/store'

export default function Setup () {
  const store = useStore((store) => store)

  const globalData = {
    name: 'Portalific',
    description: 'Offline-first, privacy-focussed, open-source personal portal'
  }

  const router = useRouter()
  const [password, setPassword] = useState(router.query.password || '')
  const [showPassword, setShowPassword] = useState(false)
  const steps = [
    {
      icon: CloudArrowDownIcon,
      completed: false,
      message: 'Loading data',
      info: null
    },
    {
      icon: LockOpenIcon,
      completed: false,
      message: 'Decrpyting data',
      info: null
    },
    {
      icon: ArrowDownTrayIcon,
      completed: false,
      message: 'Storing settings locally',
      info: null
    },
    {
      icon: ArrowRightCircleIcon,
      completed: false,
      message: 'Go to portal…',
      info: null
    }
  ]

  const startImport = () => {
    store.setSettings({
      identifier: router.query.identifier,
      synchronize: true,
      password
    })

    store.load()
  }

  useEffect(() => {
    if (store.revision) {
      router.push('/')
    }
  }, [store.revision])

  useEffect(() => {
    setPassword(router.query.password || '')
  }, [router.query])

  return (
    <Layout>
      <Seo title={globalData.name} description={globalData.description} />
      <Header name={globalData.name} />
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
                  value={router.query.identifier || 'Missing identifier'}
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
                    {step.info && (
                      <div className='error-list__message-info'>
                        {step.info}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer copyrightText={globalData.footerText} />
    </Layout>
  )
}

export function getStaticProps () {
  return { props: {} }
}
