import { Fragment, useState } from "react";
import { Switch } from "@headlessui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function FeedConfiguration({ configuration, setConfiguration }) {
  const [color, setColor] = useState("");
  const [name, setName] = useState("");
  const [feed, setFeed] = useState("");

  return (
    <Fragment>
      <div className="settings__section">
        <div className="settings__form-row">
          <div className="settings__form-group settings__form-group--large">
            <label htmlFor="title" className="settings__label">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={configuration.title ?? ""}
              onChange={(event) =>
                setConfiguration("title", event.target.value)
              }
              className="settings__input"
            />
          </div>
        </div>

        <ul className="settings__toggle-list">
          <Switch.Group as="li" className="settings__toggle-item">
            <div className="settings__toggle-content">
              <Switch.Label as="p" className="settings__toggle-label" passive>
                Show summary of feed entries
              </Switch.Label>
            </div>
            <Switch
              checked={configuration.showSummary}
              onChange={(value) => setConfiguration("showSummary", value)}
              className={`settings__switch ${configuration.showSummary ? 'settings__switch--active' : ''}`}
            >
              <span
                aria-hidden="true"
                className={`settings__switch-handle ${configuration.showSummary ? 'settings__switch-handle--active' : ''}`}
              />
            </Switch>
          </Switch.Group>
        </ul>
      </div>

      <div className="settings__section settings__section--border">
        <div className="settings__header">
          <h2 className="settings__heading">
            Feed
          </h2>
          <p className="settings__description">
            Configure a set of Atom and RSS feed sources to collect news items
            from
          </p>
        </div>
        <ul className="settings__toggle-list">
          {(configuration.feeds ?? []).map((feed) => {
            return (
              <li className="settings__form-row" key={feed.name}>
                <div
                  className="settings__form-group feed__name"
                  style={{ borderColor: feed.color }}
                >
                  {feed.name}
                </div>
                <div className="settings__form-group feed__url">
                  {feed.feed}
                </div>
                <div className="settings__form-group settings__form-group--small">
                  <button
                    type="button"
                    className="header__button header__button--danger"
                    onClick={() => {
                      setConfiguration(
                        "feeds",
                        (configuration.feeds ?? []).filter(
                          (toFilter) => toFilter.name !== feed.name
                        )
                      );
                    }}
                  >
                    <span className="sr-only">Delete feed</span>
                    <TrashIcon className="header__icon" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
          <li className="settings__form-row">
            <div className="settings__form-group settings__form-group--small">
              <label htmlFor="color" className="settings__label">
                Color
              </label>
              <input
                type="color"
                name="color"
                id="color"
                value={color ?? ""}
                onChange={(event) => setColor(event.target.value)}
                className="settings__input"
                style={{ height: "38px" }}
              />
            </div>
            <div className="settings__form-group settings__form-group--small">
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
              <label htmlFor="url" className="settings__label">
                Feed URL
              </label>
              <input
                type="text"
                name="url"
                id="url"
                value={feed ?? ""}
                onChange={(event) => setFeed(event.target.value)}
                className="settings__input"
              />
            </div>
            <div className="settings__form-group settings__form-group--small">
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  let feeds = (configuration.feeds ?? []).concat([
                    { name, feed, color },
                  ]);

                  setConfiguration("feeds", feeds);
                  setColor("");
                  setName("");
                  setFeed("");
                }}
              >
                <span className="sr-only">Add feed</span>
                <PlusIcon className="header__icon" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </Fragment>
  );
}
