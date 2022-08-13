import { Fragment, useState } from "react";
import useLocalStorage from "../../utils/useLocalStorage";
import { Disclosure, Menu, Switch, Transition } from "@headlessui/react";
import { QRCodeSVG } from "qrcode.react";
import { CogIcon, TrashIcon } from "@heroicons/react/outline";
import Modal from "../Modal";
import dynamic from "next/dynamic";

const availableModules = {
  clock: dynamic(() => import("../../modules/Clock/Configuration"), {
    suspense: false,
  }),
  countdown: dynamic(() => import("../../modules/Countdown/Configuration"), {
    suspense: false,
  }),
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Modules({ settings, modules, setModules }) {
  const [module, setModule] = useState("none");
  const [column, setColumn] = useState("1");
  const [settingsShown, setShowSettings] = useState(null);

  return (
    <Fragment>
      <div className="py-6 px-4 sm:p-6 lg:pb-8">
        <div>
          <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
            Configure Modules
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Add modules from the list of available modules and configure them.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="md:col-span-8 col-span-12">
            <label
              htmlFor="columns"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Module
            </label>
            <select
              type="text"
              name="columns"
              id="columns"
              value={module}
              onChange={(event) => setModule(event.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            >
              <option value="none">Select Module Type</option>
              <option value="calendar">Calendar</option>
              <option value="clock">Clock</option>
              <option value="countdown">Countdown</option>
              <option value="feed">Feed Reader</option>
            </select>
          </div>

          <div className="md:col-span-2 col-span-6">
            <label
              htmlFor="columns"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Column
            </label>
            <select
              type="text"
              name="columns"
              id="columns"
              value={column}
              onChange={(event) => setColumn(+event.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            >
              <option value="0">1</option>
              <option value="1">2</option>
              <option value="2">3</option>
              <option value="3">4</option>
            </select>
          </div>

          <div className="md:col-span-2 col-span-6">
            <button
              type="text"
              name="columns"
              id="columns"
              onClick={() => {
                if (module === "none") {
                  return;
                }

                if (typeof modules[column] !== "Array") {
                  modules[column] = [];
                }

                modules[column].push({
                  type: module,
                  id: (Math.random() + 1).toString(36).substring(2),
                });
                setModules([...modules]);
              }}
              className="mt-6 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Hack to make sure the grid-cols-[1234] classes are in the compiled CSS */}
      <div className="hidden grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4" />

      <ul
        className={`mt-6 pt-6 grid grid-cols-${settings.columns} gap-6 w-full`}
      >
        {[...Array(+settings.columns).keys()].map((column) => {
          return (
            <li className={""} key={column}>
              <ul>
                {(modules[column] ?? []).map((module) => {
                  const ModuleSettings = availableModules[module.type] ?? null;

                  return (
                    <li key={module.id} className="md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 border-b-0 last:border-b hover:border-b hovered-sibling:border-t-0 p-4">
                      <h3>
                        Module: <strong>{module.type}</strong>
                      </h3>
                      <div className="flex justify-end p-2 w-full">
                        {ModuleSettings && (
                          <Fragment>
                            <button
                              type="button"
                              className="flex-shrink-0 rounded-full p-1 ml-1 text-primary-200 hover:bg-primary-800 hover:text-white focus:outline-none focus:bg-primary-900 focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-900 focus:ring-white"
                              onClick={() => setShowSettings(module.id)}
                            >
                              <span className="sr-only">
                                View notifications
                              </span>
                              <CogIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <Modal
                              open={settingsShown === module.id}
                              setOpen={() => setShowSettings(null)}
                            >
                              <ModuleSettings
                                configuration={module}
                                setConfiguration={(key, value) => {
                                  module[key] = value;
                                  console.log(key, value, module);
                                  setModules([...modules]);
                                }}
                              />
                            </Modal>
                          </Fragment>
                        )}
                        <button
                          type="button"
                          className="flex-shrink-0 rounded-full p-1 ml-1 text-primary-200 hover:bg-primary-800 hover:text-white focus:outline-none focus:bg-primary-900 focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-900 focus:ring-white"
                          onClick={() => setShowSettings(module.id)}
                        >
                          <span className="sr-only">Remove module</span>
                          <TrashIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </Fragment>
  );
}
