import { useState } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function CountdownConfiguration ({
  configuration,
  setConfiguration
}) {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')

  return (
    <section className='settings-section' data-border>
      <header className='settings-header'>
        <h2>Countdown</h2>
        <p className='settings-description'>
          Configure countdowns for certain events.
        </p>
      </header>
      <ul className='toggle-list'>
        {(configuration.countdowns ?? []).map((countdown) => {
          return (
            <li className='form-row' key={countdown.name}>
              <div className='form-group' data-span='medium'>
                {countdown.date}
              </div>
              <div className='form-group'>
                {countdown.name}
              </div>
              <div className='form-group' data-width='small'>
                <button
                  type='button'
                  className='icon-button'
                  data-variant='danger'
                  onClick={() => {
                    setConfiguration(
                      'countdowns',
                      (configuration.countdowns ?? []).filter(
                        (toFilter) => toFilter.name !== countdown.name
                      )
                    )
                  }}
                >
                  <span className='sr-only'>Delete countdown</span>
                  <TrashIcon aria-hidden='true' />
                </button>
              </div>
            </li>
          )
        })}
        <li className='form-row'>
          <div className='form-group'>
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
            <label htmlFor='date'>Date</label>
            <input
              type='date'
              name='date'
              id='date'
              value={date ?? ''}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div className='form-group' data-width='small'>
            <button
              type='button'
              className='button'
              data-variant='primary'
              onClick={() => {
                const countdowns = (configuration.countdowns ?? [])
                  .concat([{ name, date }])
                  .sort((a, b) => (a.date > b.date ? 1 : -1))

                setConfiguration('countdowns', countdowns)
                setName('')
                setDate('')
              }}
            >
              <span className='sr-only'>Add countdown</span>
              <PlusIcon aria-hidden='true' />
            </button>
          </div>
        </li>
      </ul>
    </section>
  )
}
