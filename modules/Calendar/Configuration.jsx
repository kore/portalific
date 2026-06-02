import { Fragment, useState } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function CalendarConfiguration ({
  configuration,
  setConfiguration
}) {
  const [color, setColor] = useState('')
  const [name, setName] = useState('')
  const [calendar, setCalendar] = useState('')

  return (
    <>
      <div className='settings__section settings__section--border'>
        <div className='settings__header'>
          <h2 className='settings__heading'>Calendar</h2>
          <p className='settings__description'>
            Configure iCalendar files to be shown in a simplified calendar
            overview.
          </p>
        </div>
        <ul className='settings__toggle-list'>
          {(configuration.calendars ?? []).map((calendar) => {
            return (
              <li className='settings__form-row' key={calendar.name}>
                <div
                  className='settings__form-group calendar__name'
                  style={{ borderColor: calendar.color }}
                >
                  {calendar.name}
                </div>
                <div className='settings__form-group calendar__url'>
                  {calendar.calendar}
                </div>
                <div className='settings__form-group settings__form-group--small'>
                  <button
                    type='button'
                    className='header__button header__button--danger'
                    onClick={() => {
                      setConfiguration(
                        'calendars',
                        (configuration.calendars ?? []).filter(
                          (toFilter) => toFilter.name !== calendar.name
                        )
                      )
                    }}
                  >
                    <span className='sr-only'>Delete calendar</span>
                    <TrashIcon className='header__icon' aria-hidden='true' />
                  </button>
                </div>
              </li>
            )
          })}
          <li className='settings__form-row'>
            <div className='settings__form-group settings__form-group--small'>
              <label htmlFor='color' className='settings__label'>
                Color
              </label>
              <input
                type='color'
                name='color'
                id='color'
                value={color ?? ''}
                onChange={(event) => setColor(event.target.value)}
                className='settings__input'
                style={{ height: '38px' }}
              />
            </div>
            <div className='settings__form-group settings__form-group--small'>
              <label htmlFor='name' className='settings__label'>
                Name
              </label>
              <input
                type='text'
                name='name'
                id='name'
                value={name ?? ''}
                onChange={(event) => setName(event.target.value)}
                className='settings__input'
              />
            </div>
            <div className='settings__form-group'>
              <label htmlFor='url' className='settings__label'>
                Calendar URL
              </label>
              <input
                type='text'
                name='url'
                id='url'
                value={calendar ?? ''}
                onChange={(event) => setCalendar(event.target.value)}
                className='settings__input'
              />
            </div>
            <div className='settings__form-group settings__form-group--small'>
              <button
                type='button'
                className='button button--primary'
                onClick={() => {
                  const calendars = (configuration.calendars ?? []).concat([
                    { name, calendar, color }
                  ])

                  setConfiguration('calendars', calendars)
                  setColor('')
                  setName('')
                  setCalendar('')
                }}
              >
                <span className='sr-only'>Add calendar</span>
                <PlusIcon className='header__icon' aria-hidden='true' />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}
