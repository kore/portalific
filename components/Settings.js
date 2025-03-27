import { useState } from "react";
import { Cog8ToothIcon, ViewColumnsIcon } from "@heroicons/react/24/outline";
import SettingsModules from "./Settings/Modules";
import SettingsSettings from "./Settings/Settings";

const groups = [
  { name: "Settings", href: "#", icon: Cog8ToothIcon },
  { name: "Modules", href: "#", icon: ViewColumnsIcon },
];

export default function Settings({
  modules,
  setModules,
  moveModule,
  settings,
  setSettings,
}) {
  const [group, setGroup] = useState("Settings");

  return (
    <div className="settings-panel">
      <aside className="settings-panel__sidebar">
        <nav className="settings-panel__nav">
          {groups.map((item) => {
            const current = group === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setGroup(item.name)}
                className={`settings-panel__nav-button ${current ? 'settings-panel__nav-button--active' : ''}`}
                aria-current={current ? "page" : undefined}
              >
                <item.icon
                  className={`settings-panel__nav-icon ${current ? 'settings-panel__nav-icon--active' : ''}`}
                  aria-hidden="true"
                />
                <span className="settings-panel__nav-text">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="settings-panel__content">
        {group === "Settings" && (
          <SettingsSettings settings={settings} setSettings={setSettings} />
        )}
        {group === "Modules" && (
          <SettingsModules
            settings={settings}
            setSettings={setSettings}
            modules={modules}
            setModules={setModules}
            moveModule={moveModule}
          />
        )}
      </div>
    </div>
  );
}
