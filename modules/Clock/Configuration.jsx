import Switch from '../../components/Switch'

export default function ClockConfiguration ({
  configuration,
  setConfiguration
}) {
  return (
    <section className='settings-section' data-border>
      <header className='settings-header'>
        <h2>Clock</h2>
        <p className='settings-description'>
          A simple (optionally analogue) watch displaying the current time and
          date.
        </p>
      </header>
      <ul className='toggle-list'>
        <Switch
          label='Show analogue watch'
          checked={configuration.showAnalogue}
          onChange={(value) => setConfiguration('showAnalogue', value)}
        />
        <Switch
          label='Show seconds'
          checked={configuration.showSeconds}
          onChange={(value) => setConfiguration('showSeconds', value)}
        />
      </ul>
    </section>
  )
}
