import { useState } from "react";
import Link from "next/link";
import { CogIcon, ExclamationIcon } from "@heroicons/react/outline";
import Modal from "./Modal";
import Settings from "./Settings";

export default function Header({
  name,
  modules,
  setModules,
  moveModule,
  settings,
  setSettings,
  errors,
  clearErrors,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  return (
    <header className="flex w-full items-center p-2">
      <Link href="/">
        <a className="grow text-left text-2xl dark:text-white">{name}</a>
      </Link>
      {errors && !!errors.length && <button
        type="button"
        className="ml-1 shrink-0 rounded-full p-1 text-red-200 hover:bg-red-800 hover:text-white focus:bg-red-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-900 animate-pulse"
        onClick={() => setShowErrors(true)}
      >
        <span className="sr-only">View notifications</span>
        <ExclamationIcon className="h-6 w-6" aria-hidden="true" />
      </button>}
      <Modal open={showErrors} setOpen={setShowErrors}>
        <ul role="list" className="">
          {errors.map((error, index) => (
            <li key={index}>
              <div className="relative pb-8">
                {index !== errors.length - 1 ? (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className='h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-red-500'>
                      <ExclamationIcon className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-md">
                        {error.error}
                      </p>
                      {error.info && <div className="text-sm whitespace-nowrap text-gray-500">
                        {error.info}
                      </div>}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
          onClick={() => {clearErrors(); setShowErrors(false); }}
        >
          Clear all errors
        </button>
      </Modal>
      <button
        type="button"
        className="ml-1 shrink-0 rounded-full p-1 text-primary-200 hover:bg-primary-800 hover:text-white focus:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
        onClick={() => setShowSettings(true)}
      >
        <span className="sr-only">View notifications</span>
        <CogIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      <Modal open={showSettings} setOpen={setShowSettings}>
        <Settings
          modules={modules}
          setModules={setModules}
          moveModule={moveModule}
          settings={settings}
          setSettings={setSettings}
        />
      </Modal>
    </header>
  );
}
