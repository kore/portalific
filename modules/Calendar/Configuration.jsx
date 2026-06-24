import { useState } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function CalendarConfiguration ({
  configuration,
  setConfiguration
}) {
  const [color, setColor] = useState('')
  const [name, setName] = useState('')
  const [calendar, setCalendar] = useState('')

  return (
    <section className='settings-section' data-border>
      <header className='settings-header'>
        <h2>Calendar</h2>
        <p className='settings-description'>
          Configure iCalendar files to be shown in a simplified calendar
          overview.
        </p>
      </header>
      <ul className='toggle-list'>
        {(configuration.calendars ?? []).map((calendar) => {
          return (
            <li className='form-row' key={calendar.name}>
              <div
                className='form-group source-name'
                style={{ '--accent': calendar.color }}
              >
                {calendar.name}
              </div>
              <div className='form-group source-url'>
                {calendar.calendar}
              </div>
              <div className='form-group' data-width='small'>
                <button
                  type='button'
                  className='icon-button'
                  data-variant='danger'
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
                  <TrashIcon aria-hidden='true' />
                </button>
              </div>
            </li>
          )
        })}
        <li className='form-row'>
          <div className='form-group' data-width='small'>
            <label htmlFor='color'>Color</label>
            <input
              type='color'
              name='color'
              id='color'
              value={color ?? ''}
              onChange={(event) => setColor(event.target.value)}
            />
          </div>
          <div className='form-group' data-width='small'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              name='name'
              id='name'
              value={name ?? ''}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='url'>Calendar URL</label>
            <input
              type='text'
              name='url'
              id='url'
              value={calendar ?? ''}
              onChange={(event) => setCalendar(event.target.value)}
            />
          </div>
          <div className='form-group' data-width='small'>
            <button
              type='button'
              className='button'
              data-variant='primary'
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
              <PlusIcon aria-hidden='true' />
            </button>
          </div>
        </li>
      </ul>
    </section>
  )
}
