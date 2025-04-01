import { Fragment, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function CountdownConfiguration({
  configuration,
  setConfiguration,
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  return (
    <Fragment>
      <div className="settings__section settings__section--border">
        <div className="settings__header">
          <h2 className="settings__heading">Countdown</h2>
          <p className="settings__description">
            Configure countdowns for certain events.
          </p>
        </div>
        <ul role="list" className="settings__toggle-list">
          {(configuration.countdowns ?? []).map((countdown) => {
            return (
              <li className="settings__form-row" key={countdown.name}>
                <div className="settings__form-group countdown__date">
                  {countdown.date}
                </div>
                <div className="settings__form-group countdown__name">
                  {countdown.name}
                </div>
                <div className="settings__form-group settings__form-group--small">
                  <button
                    type="button"
                    className="header__button header__button--danger"
                    onClick={() => {
                      setConfiguration(
                        "countdowns",
                        (configuration.countdowns ?? []).filter(
                          (toFilter) => toFilter.name !== countdown.name
                        )
                      );
                    }}
                  >
                    <span className="sr-only">Delete countdown</span>
                    <TrashIcon className="header__icon" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
          <li className="settings__form-row">
            <div className="settings__form-group">
              <label htmlFor="name" className="settings__label">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name ?? ""}
                onChange={(event) => setName(event.target.value)}
                className="settings__input"
              />
            </div>
            <div className="settings__form-group">
              <label htmlFor="date" className="settings__label">
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={date ?? ""}
                onChange={(event) => setDate(event.target.value)}
                className="settings__input"
              />
            </div>
            <div className="settings__form-group settings__form-group--small">
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  let countdowns = (configuration.countdowns ?? [])
                    .concat([{ name, date }])
                    .sort((a, b) => (a.date > b.date ? 1 : -1));

                  setConfiguration("countdowns", countdowns);
                  setName("");
                  setDate("");
                }}
              >
                <span className="sr-only">Add countdown</span>
                <PlusIcon className="header__icon" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </Fragment>
  );
}
