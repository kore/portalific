import useStore from '../../utils/store'
import { useShallow } from 'zustand/react/shallow'

export default function Settings () {
  const [settings, setSettings, reset] = useStore(useShallow((store) => [store.settings, store.setSettings, store.reset]))

  return (
    <>
      <section className='settings-section'>
        <header className='settings-header'>
          <h2>Profile</h2>
          <p className='settings-description'>
            General settings affecting the overall behavior.
          </p>
        </header>

        <div className='settings-form'>
          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                name='name'
                id='name'
                value={settings.name ?? ''}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    name: event.target.value
                  })}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='columns'>Number of columns</label>
              <select
                name='columns'
                id='columns'
                value={settings.columns ?? ''}
                onChange={(event) =>
                  setSettings({ ...settings, columns: event.target.value })}
              >
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className='settings-section' data-border>
        <h3>Theme</h3>

        <div className='form-row'>
          <div className='form-group' data-span='full'>
            <label htmlFor='theme'>Theme</label>
            <select
              name='theme'
              id='theme'
              value={settings.theme ?? 'default'}
              onChange={(event) =>
                setSettings({ ...settings, theme: event.target.value })}
            >
              <option value='default'>Default</option>
              <option value='black'>Black Satin</option>
              <option value='green'>Polished Nature</option>
            </select>
          </div>
        </div>

        <h3>Background</h3>

        <div className='form-row'>
          <div className='form-group' data-span='narrow'>
            <label htmlFor='background-color'>Color</label>
            <input
              type='color'
              name='background-color'
              id='background-color'
              value={settings.backgroundColor ?? '#7D7AFF'}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  backgroundColor: event.target.value
                })}
            />
          </div>

          <div className='form-group' data-span='wide'>
            <label htmlFor='background-image'>Image (URL)</label>
            <input
              type='text'
              name='background-image'
              id='background-image'
              placeholder='Background image URL'
              value={settings.backgroundImage ?? ''}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  backgroundImage: event.target.value
                })}
            />
          </div>

          <div className='form-group' data-span='narrow'>
            <button
              type='button'
              className='button'
              data-variant='danger'
              onClick={() => {
                setSettings({
                  ...settings,
                  backgroundImage: undefined,
                  backgroundColor: undefined,
                  theme: 'default'
                })
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      <section className='settings-section' data-border>
        <header className='settings-header'>
          <h2>Danger Zone</h2>
          <p className='settings-description'>
            Danger zone, resetting all current state
          </p>
        </header>
        <div className='settings-actions'>
          <button
            type='button'
            className='button'
            data-variant='danger'
            onClick={() => {
              if (window.confirm('Really remove all data?')) {
                reset()
                window.location.hash = '#/'
              }
            }}
          >
            Delete
          </button>
        </div>
      </section>
    </>
  )
}
