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
    <div className='welcome'>
      <h1 className='welcome__title'>
        <span className='welcome__subtitle'>
          Offline-first, privacy-focussed, open-source personal portal
        </span>
        <span className='welcome__main-title'>Portalific</span>
      </h1>
      <p className='welcome__intro'>
        Portalific is an OpenSource browser based portal, displaying your feeds,
        your calendars, and other information of personal relevance. It works
        (almost{' '}
        <a href='#privacy' className='welcome__link'>
          *
        </a>
        ) entirely browser-based, so your data is safe and secure. For
        cross-device synchronization you can optionally use a backend to
        synchronize the data continuously between devices.
      </p>

      <h2 className='welcome__section-title'>Get Started</h2>
      <p className='welcome__text'>
        Hi
        <input
          type='text'
          name='name'
          id='name'
          value={settings.name ?? ''}
          onChange={(event) => setSetting('name', event.target.value)}
          placeholder='Your name'
          className='welcome__input welcome__input--name'
        />
        , there are various settings you can configure. Most importantly it is
        about the number of <label htmlFor='columns'>columns</label> (
        <select
          type='text'
          name='columns'
          id='columns'
          value={settings.columns ?? ''}
          onChange={(event) => setSetting('columns', event.target.value)}
          className='welcome__input welcome__input--columns'
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
          id='add-module'
          onClick={() => {
            let newModules = [...modules]
            newModules[0].unshift({
              type: 'clock',
              id: 'firstModule-' + modules[0].length,
              showAnalogue: true,
              showSeconds: true
            })
            setModules(newModules)
          }}
          className='welcome__button'
        >
          add a watch module now
        </button>
        . You can then configure the module in the settings dialog afterwards.
      </p>
      <p className='welcome__text'>
        Right now there are not too many modules available, but in the end they
        are just React components, so feel free to add addionational ones:
      </p>
      <ul className='welcome__module-list' role='list'>
        <li className='welcome__module-item'>
          <h3 className='welcome__module-title'>Clock</h3>
          <p className='welcome__module-description'>
            A simple clock including a date, optionally including an analogue
            clock.
          </p>
        </li>
        <li className='welcome__module-item'>
          <h3 className='welcome__module-title'>Countdown</h3>
          <p className='welcome__module-description'>
            Show countdowns to (for you) important days.
          </p>
        </li>
        <li className='welcome__module-item'>
          <h3 className='welcome__module-title'>Calendar</h3>
          <p className='welcome__module-description'>
            Show appointments for the next seven days from a set of ICAL
            calendars.
          </p>
        </li>
        <li className='welcome__module-item'>
          <h3 className='welcome__module-title'>Feed</h3>
          <p className='welcome__module-description'>
            Show new post from a set of RSS and Atom feeds.
          </p>
        </li>
      </ul>

      <h2 className='welcome__section-title'>Error Handling</h2>
      <p className='welcome__text'>
        Since all data is fetched locally in your browser Portalific will also
        show you errors directly in this screen. If a feed or calendar
        can&apos;t be retrieved or something similar happens an error
        notification will be show on the top right.
        <button
          id='add-error'
          onClick={() => {
            pushError(
              'An error example',
              'Created from the welcome screen to test errors.'
            )
          }}
          className='welcome__button'
        >
          Feel free to create an error
        </button>{' '}
        to see how this would look like.
      </p>

      <h2 className='welcome__section-title' id='privacy'>
        Privacy
      </h2>
      <p className='welcome__text'>
        All data is, by default, stored only in your browser, in{' '}
        <a
          className='welcome__link'
          href='https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'
        >
          Local Storage
        </a>
        .
      </p>
      <p className='welcome__text'>
        Browsers don&apos;t allow to request data from foreign domains, though,{' '}
        <a
          className='welcome__link'
          href='https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS'
        >
          unless some very specific headers are set
        </a>
        . This is why requesting feeds or calendar data has to go through a
        server-side proxy. This proxy, in theory, would allow to log all your
        calendar and feed contents. The used implementation does not log
        anything like this, and{' '}
        <a
          className='welcome__link'
          href='https://github.com/kore/portalific/blob/main/docs/allowProxy.php'
        >
          can be found in the code repository
        </a>
        . If you want to be super safe, you should host Portalific yourself and
        deploy your own allow-proxy.
      </p>
      <p className='welcome__text'>
        Optionally we allow for cross-device synchronozation of your Portalific
        configuration. This will require your configuration to be stored on a
        server. You must explicitly enable this, since it is
        <strong> not</strong> enabled by default. Your configuration will be
        stored encrypted even then, so nobody will be able to spy on your
        configuration.
      </p>
    </div>
  )
}
