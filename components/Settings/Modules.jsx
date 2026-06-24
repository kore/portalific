import { lazy, Suspense, useState } from 'react'
import {
  Cog8ToothIcon,
  TrashIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'
import ShowHideButton from './ShowHideButton'
import ErrorBoundary from '../ErrorBoundary'
import Modal from '../Modal'
import Modules from '../Modules'
import useStore from '../../utils/store'
import { useShallow } from 'zustand/react/shallow'

const availableModules = {
  clock: lazy(() => import('../../modules/Clock/Configuration')),
  countdown: lazy(() => import('../../modules/Countdown/Configuration')),
  feed: lazy(() => import('../../modules/Feed/Configuration')),
  calendar: lazy(() => import('../../modules/Calendar/Configuration')),
  webStats: lazy(() => import('../../modules/WebStats/Configuration'))
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function ModulesManager () {
  const [module, setModule] = useState('none')
  const [column, setColumn] = useState('0')
  const [settingsShown, setShowSettings] = useState(null)

  const [settings, setSettings, modules, setModules] = useStore(useShallow((store) => [store.settings, store.setSettings, store.modules, store.setModules]))

  const setDeviceVisibility = (column, index, device, hidden) => {
    const moduleToUpdate = modules[column][index]
    if (!Array.isArray(moduleToUpdate.hiddenOnDevices)) {
      moduleToUpdate.hiddenOnDevices = []
    }

    if (hidden) {
      moduleToUpdate.hiddenOnDevices.push(device)
    } else {
      moduleToUpdate.hiddenOnDevices = moduleToUpdate.hiddenOnDevices.filter(
        (item) => item !== device
      )
    }

    setModules([...modules])
  }

  return (
    <>
      <section className='settings-section'>
        <header className='settings-header'>
          <h2>Configure Modules</h2>
          <p className='settings-description'>
            Add modules from the list of available modules and configure them.
          </p>
        </header>

        <div className='form-row'>
          <div className='form-group' data-width='large'>
            <label htmlFor='columns'>Number of columns</label>
            <select
              name='columns'
              id='columns'
              value={settings.columns ?? ''}
              onChange={(event) => {
                setSettings({ ...settings, columns: event.target.value })
                setColumn(Math.min(+column, event.target.value - 1))
              }}
            >
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
            </select>
          </div>

          <div className='form-group' data-width='large'>
            <label htmlFor='moduleType'>Module</label>
            <select
              name='moduleType'
              id='moduleType'
              value={module}
              onChange={(event) => setModule(event.target.value)}
            >
              <option value='none'>Select Module Type</option>
              <option value='calendar'>Calendar</option>
              <option value='clock'>Clock</option>
              <option value='countdown'>Countdown</option>
              <option value='feed'>Feed Reader</option>
              <option value='todo'>Todo list</option>
              <option value='morningRoutine'>Morning Routine</option>
              <option value='webStats'>Access Statistics</option>
            </select>
          </div>

          <div className='form-group' data-width='small'>
            <label htmlFor='moduleColumn'>Column</label>
            <select
              name='moduleColumn'
              id='moduleColumn'
              value={column}
              onChange={(event) => setColumn(+event.target.value)}
            >
              {Array.from(Array(+settings.columns).keys()).map((column) => (
                <option key={column} value={column}>
                  {column + 1}
                </option>
              ))}
            </select>
          </div>

          <div className='form-group' data-width='small'>
            <button
              type='button'
              className='button'
              data-variant='primary'
              onClick={() => {
                if (module === 'none') {
                  return
                }

                if (!Array.isArray(modules[column])) {
                  modules[column] = []
                }

                modules[column].push({
                  type: module,
                  id: (Math.random() + 1).toString(36).substring(2)
                })
                setModules([...modules])
              }}
            >
              Add
            </button>
          </div>
        </div>
      </section>

      <section className='settings-section' data-border>
        <Modules
          pushError={() => {}}
          moduleRenderer={(module, index) => {
            const ModuleSettings = availableModules[module.type] ?? null

            return (
              <ErrorBoundary>
                <div className='module-header'>
                  <h3 className='module-title'>
                    {capitalizeFirstLetter(module.type)}
                  </h3>
                  <div className='header-buttons'>
                    {ModuleSettings && (
                      <>
                        <button
                          type='button'
                          className='icon-button'
                          data-variant='settings'
                          onClick={() => setShowSettings(module.id)}
                        >
                          <span className='sr-only'>View settings</span>
                          <Cog8ToothIcon aria-hidden='true' />
                        </button>
                        <Modal
                          open={settingsShown === module.id}
                          setOpen={() => setShowSettings(null)}
                        >
                          <Suspense fallback={null}>
                            <ModuleSettings
                              configuration={module}
                              setConfiguration={(key, value) => {
                                module[key] = value
                                setModules([...modules])
                              }}
                            />
                          </Suspense>
                        </Modal>
                      </>
                    )}
                    <button
                      type='button'
                      className='icon-button'
                      data-variant='danger'
                      onClick={() => {
                        setModules(
                          (modules ?? []).map((column) => {
                            return (column ?? []).filter((toFilter) => {
                              return toFilter.id !== module.id
                            })
                          })
                        )
                      }}
                    >
                      <span className='sr-only'>Remove module</span>
                      <TrashIcon aria-hidden='true' />
                    </button>
                  </div>
                </div>
                <div className='visibility-switcher'>
                  <ShowHideButton
                    hidden={(module.hiddenOnDevices || []).includes('mobile')}
                    onClick={(hide) => {
                      setDeviceVisibility(column, index, 'mobile', hide)
                    }}
                  >
                    <DevicePhoneMobileIcon aria-hidden='true' />
                  </ShowHideButton>
                  <ShowHideButton
                    hidden={(module.hiddenOnDevices || []).includes('tablet')}
                    onClick={(hide) => {
                      setDeviceVisibility(column, index, 'tablet', hide)
                    }}
                  >
                    <DeviceTabletIcon aria-hidden='true' />
                  </ShowHideButton>
                  <ShowHideButton
                    hidden={(module.hiddenOnDevices || []).includes('desktop')}
                    onClick={(hide) => {
                      setDeviceVisibility(column, index, 'desktop', hide)
                    }}
                  >
                    <ComputerDesktopIcon aria-hidden='true' />
                  </ShowHideButton>
                </div>
              </ErrorBoundary>
            )
          }}
        />
      </section>
    </>
  )
}
