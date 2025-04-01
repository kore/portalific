import { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import {
  Cog8ToothIcon,
  TrashIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import ShowHideButton from "./ShowHideButton";
import Column from "../Column";
import ErrorBoundary from "../ErrorBoundary";
import Modal from "../Modal";
import Module from "../Module";

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
      <div className="settings__section">
        <div className="settings__header">
          <h2 className="settings__heading">Configure Modules</h2>
          <p className="settings__description">
            Add modules from the list of available modules and configure them.
          </p>
        </div>

        <div className="settings__form-row">
          <div className="settings__form-group settings__form-group--large">
            <label htmlFor="columns" className="settings__label">
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
              className="settings__input"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className="settings__form-group settings__form-group--large">
            <label htmlFor="moduleType" className="settings__label">
              Module
            </label>
            <select
              type="text"
              name="moduleType"
              id="moduleType"
              value={module}
              onChange={(event) => setModule(event.target.value)}
              className="settings__input"
            >
              <option value="none">Select Module Type</option>
              <option value="calendar">Calendar</option>
              <option value="clock">Clock</option>
              <option value="countdown">Countdown</option>
              <option value="feed">Feed Reader</option>
              <option value="todo">Todo list</option>
            </select>
          </div>

          <div className="settings__form-group settings__form-group--small">
            <label htmlFor="moduleColumn" className="settings__label">
              Column
            </label>
            <select
              type="text"
              name="moduleColumn"
              id="moduleColumn"
              value={column}
              onChange={(event) => setColumn(+event.target.value)}
              className="settings__input"
            >
              {Array.from(Array(+settings.columns).keys()).map((column) => (
                <option key={column} value={column}>
                  {column + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="settings__form-group settings__form-group--small">
            <button
              type="button"
              className="button button--primary"
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
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="settings__section settings__section--border">
        <ul
          className={`grid grid__cols-${settings.columns}`}
          style={{ marginTop: "2rem" }}
        >
          {[...Array(+settings.columns).keys()].map((column) => {
            return (
              <Column
                key={column}
                column={column}
                length={(modules[column] ?? []).length}
                moveModule={moveModule}
              >
                <ul className="modules">
                  {(modules[column] ?? []).map((module, index) => {
                    const ModuleSettings =
                      availableModules[module.type] ?? null;

                    return (
                      <Module
                        key={module.id}
                        id={module.id}
                        column={column}
                        index={index}
                        moveModule={moveModule}
                      >
                        <ErrorBoundary>
                          <div className="module__header">
                            <h3 className="module__title">
                              {capitalizeFirstLetter(module.type)}
                            </h3>
                            <div className="header__buttons">
                              {ModuleSettings && (
                                <Fragment>
                                  <button
                                    type="button"
                                    className="header__button header__button--settings"
                                    onClick={() => setShowSettings(module.id)}
                                  >
                                    <span className="sr-only">
                                      View settings
                                    </span>
                                    <Cog8ToothIcon
                                      className="header__icon"
                                      aria-hidden="true"
                                    />
                                  </button>
                                  <Modal
                                    settings={settings}
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
                                className="header__button header__button--danger"
                                onClick={() => {
                                  setModules(
                                    (modules ?? []).map((column) => {
                                      return (column ?? []).filter(
                                        (toFilter) => {
                                          return toFilter.id !== module.id;
                                        }
                                      );
                                    })
                                  );
                                }}
                              >
                                <span className="sr-only">Remove module</span>
                                <TrashIcon
                                  className="header__icon"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="visibility-switcher">
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
                                className="visibility-switcher__icon"
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
                                className="visibility-switcher__icon"
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
                                className="visibility-switcher__icon"
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
      </div>
    </Fragment>
  );
}
