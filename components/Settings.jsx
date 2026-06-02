import { useState } from 'react'
import {
  Cog8ToothIcon,
  ArrowPathIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline'
import SettingsDisplay from './Settings/Display'
import SettingsModules from './Settings/Modules'
import SettingsSynchronization from './Settings/Synchronization'

const groups = [
  { name: 'Display', href: '#', icon: Cog8ToothIcon },
  { name: 'Synchronization', href: '#', icon: ArrowPathIcon },
  { name: 'Modules', href: '#', icon: ViewColumnsIcon }
]

export default function Settings () {
  const [group, setGroup] = useState('Display')

  return (
    <div className='settings-panel'>
      <aside className='settings-panel__sidebar'>
        <nav className='settings-panel__nav'>
          {groups.map((item) => {
            const current = group === item.name
            return (
              <button
                key={item.name}
                onClick={() => setGroup(item.name)}
                className={`settings-panel__nav-button ${
                  current ? 'settings-panel__nav-button--active' : ''
                }`}
                aria-current={current ? 'page' : undefined}
              >
                <item.icon
                  className={`settings-panel__nav-icon ${
                    current ? 'settings-panel__nav-icon--active' : ''
                  }`}
                  aria-hidden='true'
                />
                <span className='settings-panel__nav-text'>{item.name}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <div className='settings-panel__content'>
        {group === 'Display' && (
          <SettingsDisplay />
        )}
        {group === 'Synchronization' && (
          <SettingsSynchronization />
        )}
        {group === 'Modules' && (
          <SettingsModules />
        )}
      </div>
    </div>
  )
}
