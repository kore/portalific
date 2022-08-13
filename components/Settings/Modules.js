import { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import { Disclosure, Menu, Switch, Transition } from "@headlessui/react";
import { CogIcon, TrashIcon } from "@heroicons/react/outline";
import { QRCodeSVG } from "qrcode.react";
import useLocalStorage from "../../utils/useLocalStorage";
import Column from "../Column";
import Modal from "../Modal";
import Module from "../Module";

const availableModules = {
  clock: dynamic(() => import("../../modules/Clock/Configuration")),
  countdown: dynamic(() => import("../../modules/Countdown/Configuration")),
  feed: dynamic(() => import("../../modules/Feed/Configuration")),
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Modules({ settings, modules, setModules }) {
  const [module, setModule] = useState("none");
  const [column, setColumn] = useState("1");
  const [settingsShown, setShowSettings] = useState(null);

  // @TODO:
  // * Allow to move modules by drag and drop

  // Dynamic class names: grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4
  const gridClassName = "grid-cols-" + (settings.columns ?? 3);

  return (
    <Fragment>
      <div className="py-6 px-4 sm:p-6 lg:pb-8">
        <div>
          <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            Configure Modules
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Add modules from the list of available modules and configure them.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
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
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="none">Select Module Type</option>
              <option value="calendar">Calendar</option>
              <option value="clock">Clock</option>
              <option value="countdown">Countdown</option>
              <option value="feed">Feed Reader</option>
            </select>
          </div>

          <div className="col-span-6 md:col-span-2">
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
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="0">1</option>
              <option value="1">2</option>
              <option value="2">3</option>
              <option value="3">4</option>
            </select>
          </div>

          <div className="col-span-6 md:col-span-2">
            <button
              type="text"
              name="columns"
              id="columns"
              onClick={() => {
                if (module === "none") {
                  return;
                }

                if (!Array.isArray(modules[column])) {
                  modules[column] = [];
                }

                modules[column].push({
                  type: module,
                  id: (Math.random() + 1).toString(36).substring(2),
                });
                setModules([...modules]);
              }}
              className="mt-6 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <ul className={`${gridClassName} mt-6 grid w-full gap-6 pt-6`}>
        {[...Array(+settings.columns).keys()].map((column) => {
          return (
            <Column key={column}>
              <ul>
                {(modules[column] ?? []).map((module) => {
                  const ModuleSettings = availableModules[module.type] ?? null;

                  return (
                    <Module key={module.id}>
                      <h3>
                        Module: <strong>{module.type}</strong>
                      </h3>
                      <div className="flex w-full justify-end p-2">
                        {ModuleSettings && (
                          <Fragment>
                            <button
                              type="button"
                              className="ml-1 shrink-0 rounded-full p-1 text-primary-200 hover:bg-primary-800 hover:text-white focus:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
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
                          className="ml-1 shrink-0 rounded-full p-1 text-primary-200 hover:bg-primary-800 hover:text-white focus:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
                          onClick={() => {
                            setModules(
                              (modules ?? []).map((column) => {
                                return (column ?? []).filter((toFilter) => {
                                  return toFilter.id !== module.id;
                                });
                              })
                            );
                          }}
                        >
                          <span className="sr-only">Remove module</span>
                          <TrashIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Module>
                  );
                })}
              </ul>
            </Column>
          );
        })}
      </ul>
    </Fragment>
  );
}
