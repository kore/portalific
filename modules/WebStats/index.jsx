import { useState, useEffect } from 'react'
import { XCircleIcon } from '@heroicons/react/24/outline'
import DonutChart from './DonutChart'
import SimpleVisitorChart from './SimpleVisitorChart'

export default function WebStats ({ configuration }) {
  const [domains, setDomains] = useState({})
  const [error, setError] = useState(null)
  const [interval, setInterval] = useState('days')
  const [domain, setDomain] = useState(null)

  useEffect(() => {
    if (!configuration?.url || !configuration?.domains?.length) return
    setDomains({})

    const loadingPromises = []

    const loadDomainData = async (domain) => {
      try {
        const urlObj = new URL(configuration.url)
        const username = urlObj.username
        const password = urlObj.password

        // Remove credentials from URL
        urlObj.username = ''
        urlObj.password = ''
        urlObj.pathname = '/' + domain + '/' + interval

        // Set up request with Authorization header
        const headers = new Headers()
        if (username && password) {
          const encodedAuth = btoa(`${username}:${password}`)
          headers.append('Authorization', `Basic ${encodedAuth}`)
        }

        const response = await fetch(urlObj.toString(), { headers })
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const result = await response.json()

        // Validate proper JSON structure
        if (typeof result !== 'object') {
          throw new Error('Response is not a valid JSON object')
        }

        // Use functional state update to avoid stale closure issues
        setDomains((prevDomains) => ({
          ...prevDomains,
          [domain]: {
            history: result.data,
            aggregate: result.aggregate
          }
        }))
      } catch (err) {
        setError(`Error loading ${domain}: ${err.message}`)
      }
    }

    // Start all loading processes in parallel
    configuration.domains.forEach((domain) => {
      const loadPromise = loadDomainData(domain)
      loadingPromises.push(loadPromise)
    })
  }, [configuration.url, configuration.domains, interval])

  return (
    <div className='web-stats'>
      <nav className='view-switcher'>
        {['days', 'weeks', 'months'].map((buttonInterval) =>
          <button
            key={buttonInterval}
            type='button'
            onClick={() => { setInterval(buttonInterval) }}
            aria-current={interval === buttonInterval ? 'page' : undefined}
          >
            {buttonInterval[0].toUpperCase() + buttonInterval.slice(1)}
          </button>
        )}
      </nav>
      {error && <p>{error}</p>}
      {!domain &&
        Object.keys(domains)
          .sort()
          .map((domainName) => (
            <SimpleVisitorChart
              onClick={() => setDomain(domainName)}
              interval={interval}
              domain={domainName}
              data={domains[domainName].history}
              key={domainName}
            />
          ))}
      {domain && (
        <>
          <h4>
            <button
              type='button'
              className='web-stats-back'
              aria-label='Back to all domains'
              onClick={() => setDomain(null)}
            >
              <XCircleIcon aria-hidden='true' />
            </button>{' '}
            {domain}
          </h4>
          <ul className='web-stats-charts'>
            <li>
              <DonutChart
                title='Browsers'
                data={domains[domain]?.aggregate?.browser || {}}
              />
            </li>
            <li>
              <DonutChart
                title='Platforms'
                data={domains[domain]?.aggregate?.platform || {}}
              />
            </li>
            <li>
              <DonutChart
                title='Referer'
                data={domains[domain]?.aggregate?.referer || {}}
              />
            </li>
            <li>
              <DonutChart
                title='Source'
                data={domains[domain]?.aggregate?.trackingModule || {}}
              />
            </li>
          </ul>
        </>
      )}
    </div>
  )
}
