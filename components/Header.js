import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CogIcon, ExclamationIcon } from "@heroicons/react/outline";
import Modal from "./Modal";
import Settings from "./Settings";
import logo from "../images/logo.svg";

export default function Header({
  name,
  modules = [],
  setModules = null,
  moveModule = null,
  settings = {},
  setSettings = null,
  errors = [],
  clearErrors = null,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  return (
    <header className="flex w-full grow-0 items-center p-2">
      <div className="inline-block relative h-8 w-8 mr-2">
        <Image src={logo} layout="fill" alt="Torii" />
      </div>
      <Link href="/">
        <a className="grow text-left text-2xl dark:text-white">
          {settings.name && settings.name + "'s "}
          {name}
        </a>
      </Link>
      {errors && !!errors.length && (
        <button
          type="button"
          className="ml-1 shrink-0 animate-pulse rounded-full p-1 text-red-200 hover:bg-red-800 hover:text-white focus:bg-red-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-900"
          onClick={() => setShowErrors(true)}
        >
          <span className="sr-only">View notifications</span>
          <ExclamationIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
      <Modal open={showErrors} setOpen={setShowErrors}>
        <ul role="list" className="">
          {errors.map((error, index) => (
            <li key={index}>
              <div className="relative pb-8">
                {index !== errors.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 ring-8 ring-white">
                      <ExclamationIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-base">{error.error}</p>
                      {error.info && (
                        <div className="whitespace-nowrap text-sm text-gray-500">
                          {error.info}
                        </div>
                      )}
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
          onClick={() => {
            clearErrors();
            setShowErrors(false);
          }}
        >
          Clear all errors
        </button>
      </Modal>
      {setSettings && (
        <button
          type="button"
          className="ml-1 shrink-0 rounded-full p-1 text-primary-200 hover:bg-primary-800 hover:text-white focus:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
          onClick={() => setShowSettings(true)}
        >
          <span className="sr-only">View notifications</span>
          <CogIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
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
