import { Fragment } from 'react'
import { Switch } from '@headlessui/react'

export default function ClockConfiguration ({
  configuration,
  setConfiguration
}) {
  return (
    <>
      <div className='settings__section settings__section--border'>
        <div className='settings__header'>
          <h2 className='settings__heading'>Clock</h2>
          <p className='settings__description'>
            A simple (optionally analogue) watch displaying the current time and
            date.
          </p>
        </div>
        <ul className='settings__toggle-list'>
          <Switch.Group as='li' className='settings__toggle-item'>
            <div className='settings__toggle-content'>
              <Switch.Label as='p' className='settings__toggle-label' passive>
                Show analogue watch
              </Switch.Label>
            </div>
            <Switch
              checked={configuration.showAnalogue}
              onChange={(value) => setConfiguration('showAnalogue', value)}
              className={`settings__switch ${
                configuration.showAnalogue ? 'settings__switch--active' : ''
              }`}
            >
              <span
                aria-hidden='true'
                className={`settings__switch-handle ${
                  configuration.showAnalogue
                    ? 'settings__switch-handle--active'
                    : ''
                }`}
              />
            </Switch>
          </Switch.Group>
          <Switch.Group as='li' className='settings__toggle-item'>
            <div className='settings__toggle-content'>
              <Switch.Label as='p' className='settings__toggle-label' passive>
                Show seconds
              </Switch.Label>
            </div>
            <Switch
              checked={configuration.showSeconds}
              onChange={(value) => setConfiguration('showSeconds', value)}
              className={`settings__switch ${
                configuration.showSeconds ? 'settings__switch--active' : ''
              }`}
            >
              <span
                aria-hidden='true'
                className={`settings__switch-handle ${
                  configuration.showSeconds
                    ? 'settings__switch-handle--active'
                    : ''
                }`}
              />
            </Switch>
          </Switch.Group>
        </ul>
      </div>
    </>
  )
}
