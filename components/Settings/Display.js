import { Fragment } from "react";

export default function Settings({ settings, setSettings }) {
  return (
    <Fragment>
      {/* Main section */}
      <div className="settings__section">
        <div className="settings__header">
          <h2 className="settings__heading">Profile</h2>
          <p className="settings__description">
            General settings affecting the overall behavior.
          </p>
        </div>

        <div className="settings__form">
          <div className="settings__form-row">
            <div className="settings__form-group">
              <label htmlFor="name" className="settings__label">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={settings.name ?? ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    name: event.target.value,
                  })
                }
                className="settings__input"
              />
            </div>

            <div className="settings__form-group">
              <label htmlFor="columns" className="settings__label">
                Number of columns
              </label>
              <select
                name="columns"
                id="columns"
                value={settings.columns ?? ""}
                onChange={(event) =>
                  setSettings({ ...settings, columns: event.target.value })
                }
                className="settings__input"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="settings__section settings__section--border">
        <div className="settings__content">
          <h2 className="settings__subheading">Theme</h2>

          <div className="settings__form-row">
            <div
              className="settings__form-group"
              style={{ gridColumn: "1/13" }}
            >
              <label htmlFor="theme" className="settings__label">
                Theme
              </label>
              <select
                name="theme"
                id="theme"
                value={settings.theme ?? "default"}
                onChange={(event) =>
                  setSettings({ ...settings, theme: event.target.value })
                }
                className="settings__input"
              >
                <option value="default">Default</option>
                <option value="black">Black Satin</option>
                <option value="green">Polished Nature</option>
              </select>
            </div>
          </div>

          <h3 className="settings__subheading">Background</h3>

          <div className="settings__form-row">
            <div className="settings__form-group" style={{ gridColumn: "1/3" }}>
              <label htmlFor="background-color" className="settings__label">
                Color
              </label>
              <input
                type="color"
                name="background-color"
                id="background-color"
                value={settings.backgroundColor ?? "#7D7AFF"}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    backgroundColor: event.target.value,
                  })
                }
                className="settings__input"
                style={{ height: "38px" }}
              />
            </div>

            <div
              className="settings__form-group"
              style={{ gridColumn: "3/11" }}
            >
              <label htmlFor="background-image" className="settings__label">
                Image (URL)
              </label>
              <input
                type="text"
                name="background-image"
                id="background-image"
                placeholder="Background image URL"
                value={settings.backgroundImage ?? ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    backgroundImage: event.target.value,
                  })
                }
                className="settings__input"
              />
            </div>

            <div
              className="settings__form-group"
              style={{ gridColumn: "11/13" }}
            >
              <button
                type="button"
                className="button button--danger"
                onClick={() => {
                  setSettings({
                    ...settings,
                    backgroundImage: undefined,
                    backgroundColor: undefined,
                    theme: "default",
                  });
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="settings__section settings__section--border">
        <div className="settings__content">
          <div className="settings__header">
            <h2 className="settings__heading">Danger Zone</h2>
            <p className="settings__description">
              Danger zone, resetting all current state
            </p>
          </div>
          <div className="settings__actions">
            <button
              type="button"
              className="button button--danger"
              onClick={() => {
                if (confirm("Really remove all data?")) {
                  localStorage.removeItem("theme");
                  localStorage.removeItem("settings");
                  localStorage.removeItem("modules");
                  window.location = "/";
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
