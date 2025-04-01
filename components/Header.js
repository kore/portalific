import { useState } from "react";
import Link from "next/link";
import {
  Cog8ToothIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Logo from "./Logo";
import Modal from "./Modal";
import Settings from "./Settings";

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
    <header className="header">
      <Logo className="header__logo" />
      <Link href="/" className="header__title">
        {settings.name && settings.name + "'s "}
        {name}
      </Link>
      {errors && !!errors.length && (
        <button
          type="button"
          className="header__button header__button--error"
          onClick={() => setShowErrors(true)}
        >
          <span className="sr-only">View notifications</span>
          <ExclamationTriangleIcon
            className="header__icon"
            aria-hidden="true"
          />
        </button>
      )}
      <Modal settings={settings} open={showErrors} setOpen={setShowErrors}>
        <ul className="error-list">
          {errors.map((error, index) => (
            <li key={index} className="error-list__item">
              {index !== errors.length - 1 ? (
                <span className="error-list__separator" aria-hidden="true" />
              ) : null}
              <div className="error-list__content">
                <div>
                  <span className="error-list__icon-container">
                    <ExclamationTriangleIcon
                      className="error-list__icon"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="error-list__message">
                  <p>{error.error}</p>
                  {error.info && (
                    <div className="error-list__message-info">{error.info}</div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="button button--secondary"
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
          className="header__button header__button--settings"
          onClick={() => setShowSettings(true)}
        >
          <span className="sr-only">View settings</span>
          <Cog8ToothIcon className="header__icon" aria-hidden="true" />
        </button>
      )}
      <Modal settings={settings} open={showSettings} setOpen={setShowSettings}>
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
