import { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import {
  Cog8ToothIcon,
  TrashIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import Column from "../Column";
import ErrorBoundary from "../ErrorBoundary";
import Modal from "../Modal";
import Module from "../Module";
import ShowHideButton from "./ShowHideButton";

const availableModules = {
  clock: dynamic(() => import("../../modules/Clock/Configuration")),
  countdown: dynamic(() => import("../../modules/Countdown/Configuration")),
  feed: dynamic(() => import("../../modules/Feed/Configuration")),
  calendar: dynamic(() => import("../../modules/Calendar/Configuration")),
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Modules({
  settings,
  setSettings,
  modules,
  setModules,
  moveModule,
}) {
  const [module, setModule] = useState("none");
  const [column, setColumn] = useState("0");
  const [settingsShown, setShowSettings] = useState(null);

  // Dynamic class names: grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4
  const gridClassName = "grid-cols-" + (settings.columns ?? 3);

  const setDeviceVisibility = (column, index, device, hidden) => {
    let moduleToUpdate = modules[column][index];
    if (!Array.isArray(moduleToUpdate.hiddenOnDevices)) {
      moduleToUpdate.hiddenOnDevices = [];
    }

    if (hidden) {
      moduleToUpdate.hiddenOnDevices.push(device);
    } else {
      moduleToUpdate.hiddenOnDevices = moduleToUpdate.hiddenOnDevices.filter(
        (item) => item !== device
      );
    }

    setModules([...modules]);
  };

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
          <div className="col-span-12">
            <label
              htmlFor="columns"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Number of columns
            </label>
            <select
              type="text"
              name="columns"
              id="columns"
              value={settings.columns ?? ""}
              onChange={(event) => {
                setSettings({ ...settings, columns: event.target.value });
                setColumn(Math.min(+column, event.target.value - 1));
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

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
              <option value="todo">Todo list</option>
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
              {Array.from(Array(+settings.columns).keys()).map((column) => (
                <option key={column} value={column}>
                  {column + 1}
                </option>
              ))}
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

      <ul className={`${gridClassName} mt-6 grid w-full gap-6 p-2 pt-6`}>
        {[...Array(+settings.columns).keys()].map((column) => {
          return (
            <Column
              key={column}
              column={column}
              length={(modules[column] ?? []).length}
              moveModule={moveModule}
            >
              <ul>
                {(modules[column] ?? []).map((module, index) => {
                  const ModuleSettings = availableModules[module.type] ?? null;

                  return (
                    <Module
                      key={module.id}
                      id={module.id}
                      column={column}
                      index={index}
                      moveModule={moveModule}
                    >
                      <ErrorBoundary>
                        <div className="flex">
                          <h3>
                            <strong>
                              {capitalizeFirstLetter(module.type)}
                            </strong>
                          </h3>
                          <div className="flex grow justify-end">
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
                                  <Cog8ToothIcon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                  />
                                </button>
                                <Modal
                                  open={settingsShown === module.id}
                                  setOpen={() => setShowSettings(null)}
                                >
                                  <ModuleSettings
                                    configuration={module}
                                    setConfiguration={(key, value) => {
                                      module[key] = value;
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
                              <TrashIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="m-2 mx-auto flex grow-0 justify-center gap-2 rounded-3xl bg-gray-200 p-1 dark:bg-gray-800">
                          <ShowHideButton
                            hidden={(module.hiddenOnDevices || []).includes(
                              "mobile"
                            )}
                            onClick={(hide) => {
                              setDeviceVisibility(
                                column,
                                index,
                                "mobile",
                                hide
                              );
                            }}
                          >
                            <DevicePhoneMobileIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </ShowHideButton>
                          <ShowHideButton
                            hidden={(module.hiddenOnDevices || []).includes(
                              "tablet"
                            )}
                            onClick={(hide) => {
                              setDeviceVisibility(
                                column,
                                index,
                                "tablet",
                                hide
                              );
                            }}
                          >
                            <DeviceTabletIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </ShowHideButton>
                          <ShowHideButton
                            hidden={(module.hiddenOnDevices || []).includes(
                              "desktop"
                            )}
                            onClick={(hide) => {
                              setDeviceVisibility(
                                column,
                                index,
                                "desktop",
                                hide
                              );
                            }}
                          >
                            <ComputerDesktopIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </ShowHideButton>
                        </div>
                      </ErrorBoundary>
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
