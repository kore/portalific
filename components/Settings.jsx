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
      <aside className='settings-sidebar'>
        <nav className='settings-nav'>
          {groups.map((item) => {
            const current = group === item.name
            return (
              <button
                key={item.name}
                onClick={() => setGroup(item.name)}
                aria-current={current ? 'page' : undefined}
              >
                <item.icon aria-hidden='true' />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <div className='settings-content'>
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
