import { Fragment, useState } from 'react'
import useLocalStorage from '../utils/useLocalStorage';
import { Disclosure, Menu, Switch, Transition } from '@headlessui/react';
import { CogIcon, ViewGridAddIcon } from '@heroicons/react/outline';

import SettingsSettings from './Settings/Settings';
import SettingsModules from './Settings/Modules';

const groups = [
  { name: 'Settings', href: '#', icon: CogIcon },
  { name: 'Modules', href: '#', icon: ViewGridAddIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Settings() {
  const [group, setGroup] = useState('Settings');

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-600 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
      <aside className="py-6 lg:col-span-3">
        <nav className="space-y-1">
          {groups.map((item) => {
            const current = group === item.name;
            return <button
              key={item.name}
              onClick={() => setGroup(item.name)}
              className={classNames(
                current
                  ? 'bg-primary-50 dark:bg-primary-800 border-primary-500 text-primary-700 dark:text-primary-300 hover:bg-primary-50 hover:text-primary-700 hover:dark:text-primary-300'
                  : 'border-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-50 hover:dark:bg-gray-700 hover:text-gray-900 hover:dark:text-gray-100',
                'group border-l-4 px-3 py-2 flex items-center text-sm font-medium block w-full'
              )}
              aria-current={current ? 'page' : undefined}
            >
              <item.icon
                className={classNames(
                  current
                    ? 'text-primary-500 dark:text-primary-300 group-hover:text-primary-500'
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-300',
                  'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </button>
          })}
        </nav>
      </aside>

      <div className="divide-y divide-gray-200 dark:divide-gray-600 lg:col-span-9">
        {group === 'Settings' && <SettingsSettings />}
        {group === 'Modules' && <SettingsModules />}
      </div>
    </div>
  )
}
