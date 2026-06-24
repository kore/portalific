import useStore from '../utils/store'
import { useShallow } from 'zustand/react/shallow'

export default function Welcome () {
  const [settings, setSettings, modules, setModules, pushError] = useStore(useShallow((store) => [store.settings, store.setSettings, store.modules, store.setModules, store.pushError]))

  const setSetting = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: value
    })
  }

  return (
    <article className='welcome'>
      <h1>
        <span className='welcome-subtitle'>
          Offline-first, privacy-focussed, open-source personal portal
        </span>
        <span className='welcome-main-title'>Portalific</span>
      </h1>
      <p className='welcome-intro'>
        Portalific is an OpenSource browser based portal, displaying your feeds,
        your calendars, and other information of personal relevance. It works
        (almost <a href='#privacy'>*</a>) entirely browser-based, so your data is
        safe and secure. For cross-device synchronization you can optionally use
        a backend to synchronize the data continuously between devices.
      </p>

      <h2>Get Started</h2>
      <p>
        Hi
        <input
          type='text'
          name='name'
          id='name'
          value={settings.name ?? ''}
          onChange={(event) => setSetting('name', event.target.value)}
          placeholder='Your name'
        />
        , there are various settings you can configure. Most importantly it is
        about the number of <label htmlFor='columns'>columns</label> (
        <select
          name='columns'
          id='columns'
          value={settings.columns ?? ''}
          onChange={(event) => setSetting('columns', event.target.value)}
        >
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
        </select>
        ) used for the portal and then the actual modules. Modules can be added
        and configured in the settings dialog on the top-right and then moved by
        drag and drop between those columns. If you like, you can, for example,
        <button
          type='button'
          id='add-module'
          onClick={() => {
            const newModules = [...modules]
            newModules[0].unshift({
              type: 'clock',
              id: 'firstModule-' + modules[0].length,
              showAnalogue: true,
              showSeconds: true
            })
            setModules(newModules)
          }}
        >
          add a watch module now
        </button>
        . You can then configure the module in the settings dialog afterwards.
      </p>
      <p>
        Right now there are not too many modules available, but in the end they
        are just React components, so feel free to add addionational ones:
      </p>
      <ul>
        <li>
          <h3>Clock</h3>
          <p>
            A simple clock including a date, optionally including an analogue
            clock.
          </p>
        </li>
        <li>
          <h3>Countdown</h3>
          <p>Show countdowns to (for you) important days.</p>
        </li>
        <li>
          <h3>Calendar</h3>
          <p>
            Show appointments for the next seven days from a set of ICAL
            calendars.
          </p>
        </li>
        <li>
          <h3>Feed</h3>
          <p>Show new post from a set of RSS and Atom feeds.</p>
        </li>
      </ul>

      <h2>Error Handling</h2>
      <p>
        Since all data is fetched locally in your browser Portalific will also
        show you errors directly in this screen. If a feed or calendar
        can&apos;t be retrieved or something similar happens an error
        notification will be show on the top right.
        <button
          type='button'
          id='add-error'
          onClick={() => {
            pushError(
              'An error example',
              'Created from the welcome screen to test errors.'
            )
          }}
        >
          Feel free to create an error
        </button>{' '}
        to see how this would look like.
      </p>

      <h2 id='privacy'>Privacy</h2>
      <p>
        All data is, by default, stored only in your browser, in{' '}
        <a href='https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'>
          Local Storage
        </a>
        .
      </p>
      <p>
        Browsers don&apos;t allow to request data from foreign domains, though,{' '}
        <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS'>
          unless some very specific headers are set
        </a>
        . This is why requesting feeds or calendar data has to go through a
        server-side proxy. This proxy, in theory, would allow to log all your
        calendar and feed contents. The used implementation does not log
        anything like this, and{' '}
        <a href='https://github.com/kore/portalific/blob/main/docs/allowProxy.php'>
          can be found in the code repository
        </a>
        . If you want to be super safe, you should host Portalific yourself and
        deploy your own allow-proxy.
      </p>
      <p>
        Optionally we allow for cross-device synchronozation of your Portalific
        configuration. This will require your configuration to be stored on a
        server. You must explicitly enable this, since it is
        <strong> not</strong> enabled by default. Your configuration will be
        stored encrypted even then, so nobody will be able to spy on your
        configuration.
      </p>
    </article>
  )
}
