import { useState } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import Switch from '../../components/Switch'

export default function FeedConfiguration ({ configuration, setConfiguration }) {
  const [color, setColor] = useState('')
  const [name, setName] = useState('')
  const [feed, setFeed] = useState('')

  return (
    <>
      <section className='settings-section'>
        <div className='form-row'>
          <div className='form-group' data-width='large'>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              name='title'
              id='title'
              value={configuration.title ?? ''}
              onChange={(event) =>
                setConfiguration('title', event.target.value)}
            />
          </div>
        </div>

        <ul className='toggle-list'>
          <Switch
            label='Show summary of feed entries'
            checked={configuration.showSummary}
            onChange={(value) => setConfiguration('showSummary', value)}
          />
        </ul>
      </section>

      <section className='settings-section' data-border>
        <header className='settings-header'>
          <h2>Feed</h2>
          <p className='settings-description'>
            Configure a set of Atom and RSS feed sources to collect news items
            from
          </p>
        </header>
        <ul className='toggle-list'>
          {(configuration.feeds ?? []).map((feed) => {
            return (
              <li className='form-row' key={feed.name}>
                <div
                  className='form-group source-name'
                  data-span='medium'
                  style={{ '--accent': feed.color }}
                >
                  {feed.name}
                </div>
                <div className='form-group source-url'>
                  {feed.feed}
                </div>
                <div className='form-group' data-width='small'>
                  <button
                    type='button'
                    className='icon-button'
                    data-variant='danger'
                    onClick={() => {
                      setConfiguration(
                        'feeds',
                        (configuration.feeds ?? []).filter(
                          (toFilter) => toFilter.name !== feed.name
                        )
                      )
                    }}
                  >
                    <span className='sr-only'>Delete feed</span>
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
              <label htmlFor='url'>Feed URL</label>
              <input
                type='text'
                name='url'
                id='url'
                value={feed ?? ''}
                onChange={(event) => setFeed(event.target.value)}
              />
            </div>
            <div className='form-group' data-width='small'>
              <button
                type='button'
                className='button'
                data-variant='primary'
                onClick={() => {
                  const feeds = (configuration.feeds ?? []).concat([
                    { name, feed, color }
                  ])

                  setConfiguration('feeds', feeds)
                  setColor('')
                  setName('')
                  setFeed('')
                }}
              >
                <span className='sr-only'>Add feed</span>
                <PlusIcon aria-hidden='true' />
              </button>
            </div>
          </li>
        </ul>
      </section>
    </>
  )
}
