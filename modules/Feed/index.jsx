import { useState, useEffect } from 'react'
import {
  ArrowPathIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import Parser from 'rss-parser'
import mapFeedItems from './mapFeedItems'
import resolveAllPromises from '../../utils/resolveAllPromises'
import useStore, { API_AUTH_HEADER } from '../../utils/store'
import { useShallow } from 'zustand/react/shallow'

export default function Feed ({
  configuration,
  updateModuleConfiguration
}) {
  const pushError = useStore(useShallow((store) => store.pushError))
  const [feedItems, setFeedItems] = useState([])
  const [updated, setUpdated] = useState(null)

  const updateFeeds = async () => {
    setUpdated(null)
    let feeds = (configuration.feeds ?? []).map((feed) => {
      return {
        ...feed,
        response: axios.get(
          'https://local-storage-storage.io/proxy/portalific?url=' +
            encodeURIComponent(feed.feed),
          { headers: API_AUTH_HEADER }
        )
      }
    })
    feeds = await resolveAllPromises(feeds)

    feeds = feeds
      .map((feed) => {
        if (feed.response instanceof Promise) {
          feed.response.catch((response) => {
            pushError(
              response.message,
              `Feed: ${feed.name}, URL: ${feed.feed}`
            )
          })

          return null
        }

        const parser = new Parser()
        return {
          ...feed,
          parsed: parser.parseString(feed.response.data),
          response: null
        }
      })
      .filter((item) => !!item)
    feeds = await resolveAllPromises(feeds)

    const allItems = feeds.map(mapFeedItems)

    const items = [].concat.apply([], allItems)
    items.sort((a, b) => (a.date < b.date ? 1 : -1))
    setFeedItems([...new Map(items.map((item) => [item.id, item])).values()])
    setUpdated(new Date())
  }

  const markRead = (source = null) => {
    configuration.read = feedItems
      .filter((item) => {
        if (source === null) {
          return true
        }

        return item.source === source
      })
      .map((item) => {
        return item.id
      })

    updateModuleConfiguration({ ...configuration })
  }

  useEffect(() => {
    updateFeeds()
    const interval = setInterval(updateFeeds, 5 * 60 * 1000)

    return () => {
      clearInterval(interval)
    }

    // updateFeeds is just a locally scoped function. There is no need for the
    // effect to depend on it:
  }, [configuration.feeds])

  return (
    <>
      <header className='feed-header'>
        <div className='feed-title'>
          {configuration.title
            ? configuration.title
            : (configuration.feeds ?? []).map((feed) => feed.name).join(', ')}
        </div>
        <div className='feed-update-time'>
          {updated
            ? (
              <span className='feed-time'>
                {updated.toLocaleTimeString('de-DE', { timeStyle: 'short' })}
              </span>
              )
            : (
              <ArrowPathIcon className='feed-loading' aria-hidden='true' />
              )}
        </div>
        {(configuration.feeds || []).length < 2
          ? (
            <button
              type='button'
              className='feed-mark-read'
              onClick={() => markRead()}
            >
              <span className='sr-only'>Mark all entries read</span>
              <CheckIcon aria-hidden='true' title='Mark all entries read' />
            </button>
            )
          : (
            <div className='feed-menu'>
              <div className='feed-menu-buttons'>
                <button
                  type='button'
                  className='feed-mark-all'
                  onClick={() => markRead()}
                >
                  <span className='sr-only'>Mark all entries read</span>
                  <CheckIcon aria-hidden='true' title='Mark all entries read' />
                </button>
                <details>
                  <summary className='feed-dropdown-toggle'>
                    <span className='sr-only'>Mark a single feed read</span>
                    <ChevronDownIcon aria-hidden='true' />
                  </summary>
                  <div className='feed-dropdown'>
                    {configuration.feeds.map((feed) => {
                      return (
                        <button
                          type='button'
                          key={feed.name}
                          onClick={() => markRead(feed.name)}
                        >
                          {feed.name}{' '}
                          <CheckIcon
                            aria-hidden='true'
                            title='Mark all entries read'
                          />
                        </button>
                      )
                    })}
                  </div>
                </details>
              </div>
            </div>
            )}
      </header>
      <ul className='feed-list'>
        {feedItems.map((feedItem) => {
          if (
            Array.isArray(configuration.read) &&
            configuration.read.includes(feedItem.id)
          ) {
            return null
          }

          return (
            <li key={feedItem.id}>
              <a
                className='feed-link'
                style={{ '--accent': feedItem.color }}
                href={feedItem.link}
                onMouseUp={() => {
                  // We delay marking the item as read, otherwise the link will
                  // not open. 100ms seem to be reliable, but we might have to
                  // increase this even further. With 10ms the link only opens
                  // sometimes…
                  window.setTimeout(() => {
                    if (!Array.isArray(configuration.read)) {
                      configuration.read = []
                    }

                    configuration.read.push(feedItem.id)

                    // Limit read items to the last 256
                    configuration.read = configuration.read.slice(-256)
                    updateModuleConfiguration({ ...configuration })
                  }, 100)

                  return true
                }}
                target='_blank'
                rel='noreferrer'
              >
                <span className='feed-source'>[{feedItem.source}]</span>{' '}
                {feedItem.title}
                {configuration.showSummary && feedItem.summary && (
                  <span className='feed-summary'>
                    {feedItem.summary.replace(/<[^>]*>/g, '')}
                  </span>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </>
  )
}
