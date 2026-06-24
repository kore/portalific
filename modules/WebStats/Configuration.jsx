import { useEffect, useState } from 'react'
import Switch from '../../components/Switch'

export default function WebStatsConfiguration ({
  configuration,
  setConfiguration
}) {
  const [domains, setDomains] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!configuration?.url) return;

    (async () => {
      try {
        // https://kore:kaspordsdakvfmlsa@stats.k023.de/
        // Extract credentials from URL to use in headers
        const urlObj = new URL(configuration.url)
        const username = urlObj.username
        const password = urlObj.password

        // Remove credentials from URL
        urlObj.username = ''
        urlObj.password = ''
        const cleanUrl = urlObj.toString()

        // Set up request with Authorization header
        const headers = new Headers()
        if (username && password) {
          const encodedAuth = btoa(`${username}:${password}`)
          headers.append('Authorization', `Basic ${encodedAuth}`)
        }

        const response = await fetch(cleanUrl, { headers })
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const result = await response.json()

        // Validate proper JSON structure
        if (typeof result !== 'object' && !Array.isArray(result)) {
          throw new Error('Response is not a valid JSON object or array')
        }

        setDomains(result.domains || [])
        setError(null)
      } catch (err) {
        setError(err.message)
      }
    })()
  }, [configuration.url])

  // Handle toggling a domain on or off
  const toggleDomain = (domainName, isActive) => {
    // Initialize domains array if it doesn't exist
    const currentDomains = configuration.domains || []

    if (isActive) {
      // Add domain if not already in the list
      if (!currentDomains.includes(domainName)) {
        setConfiguration('domains', [...currentDomains, domainName])
      }
    } else {
      // Remove domain from the list
      setConfiguration(
        'domains',
        currentDomains.filter((name) => name !== domainName)
      )
    }
  }

  // Check if domain is in the configuration.domains array
  const isDomainActive = (domainName) => {
    return (
      Array.isArray(configuration.domains) &&
      configuration.domains.includes(domainName)
    )
  }

  return (
    <section className='settings-section'>
      <div className='form-row'>
        <div className='form-group' data-width='large'>
          <label htmlFor='title'>Base URL</label>
          <input
            type='text'
            name='title'
            id='title'
            placeholder='https://user:password@domain/'
            value={configuration.url ?? ''}
            onChange={(event) => setConfiguration('url', event.target.value)}
          />
        </div>
      </div>
      <p className='settings-label'>
        Web statistics in the format as exposed by{' '}
        <a href='https://github.com/kore/SimpleWebStatsApi' target='_blank' rel='noreferrer'>
          https://github.com/kore/SimpleWebStatsApi
        </a>
      </p>
      {error && <p>{error}</p>}
      <ul className='toggle-list'>
        {domains.map((domain) => {
          return (
            <Switch
              key={domain.name}
              label={domain.name}
              checked={isDomainActive(domain.name)}
              onChange={(value) => toggleDomain(domain.name, value)}
              data-active={isDomainActive(domain.name) || undefined}
            />
          )
        })}
      </ul>
    </section>
  )
}
