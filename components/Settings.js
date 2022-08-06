import { Fragment, useState } from 'react'
import { Disclosure, Menu, Switch, Transition } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/solid'
import {
  BellIcon,
  CogIcon,
  CreditCardIcon,
  KeyIcon,
  MenuIcon,
  UserCircleIcon,
  ViewGridAddIcon,
  XIcon,
} from '@heroicons/react/outline'

const settings = [
  { name: 'Settings', href: '#', icon: CogIcon, current: true },
  { name: 'Modules', href: '#', icon: ViewGridAddIcon, current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Settings() {
  const [availableToHire, setAvailableToHire] = useState(true)

  return (
    <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
      <aside className="py-6 lg:col-span-3">
        <nav className="space-y-1">
          {settings.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? 'bg-primary-50 border-primary-500 text-primary-700 hover:bg-primary-50 hover:text-primary-700'
                  : 'border-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100',
                'group border-l-4 px-3 py-2 flex items-center text-sm font-medium'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? 'text-primary-500 group-hover:text-primary-500'
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-300',
                  'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      <form className="divide-y divide-gray-200 lg:col-span-9" action="#" method="POST">
        {/* Profile section */}
        <div className="py-6 px-4 sm:p-6 lg:pb-8">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Profile</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Privacy section */}
        <div className="pt-6 divide-y divide-gray-200">
          <div className="px-4 sm:px-6">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Privacy</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                Ornare eu a volutpat eget vulputate. Fringilla commodo amet.
              </p>
            </div>
            <ul role="list" className="mt-2 divide-y divide-gray-200">
              <Switch.Group as="li" className="py-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <Switch.Label as="p" className="text-sm font-medium text-gray-900 dark:text-gray-100" passive>
                    Available to hire
                  </Switch.Label>
                  <Switch.Description className="text-sm text-gray-500 dark:text-gray-300">
                    Nulla amet tempus sit accumsan. Aliquet turpis sed sit lacinia.
                  </Switch.Description>
                </div>
                <Switch
                  checked={availableToHire}
                  onChange={setAvailableToHire}
                  className={classNames(
                    availableToHire ? 'bg-primary-500' : 'bg-gray-200',
                    'ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      availableToHire ? 'translate-x-5' : 'translate-x-0',
                      'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
              </Switch.Group>
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}
