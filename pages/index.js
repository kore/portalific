import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import Column from "../components/Column";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Module from "../components/Module";
import SEO from "../components/SEO";
import NotFound from "../modules/NotFound";
import Welcome from "../modules/Welcome";

const availableModules = {
  clock: dynamic(() => import("../modules/Clock")),
  countdown: dynamic(() => import("../modules/Countdown")),
  feed: dynamic(() => import("../modules/Feed")),
  calendar: dynamic(() => import("../modules/Calendar")),
  todo: dynamic(() => import("../modules/TodoList")),
  notfound: NotFound,
  welcome: Welcome,
};

export default function Index() {
  const globalData = {
    name: "Portalific",
    description: "Offline-first, privacy-focussed, open-source personal portal",
  };

  const [revision, setRevision] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState([]);
  const [settings, setSettingsState] = useState({ columns: 1 });
  const [modules, setModulesState] = useState([
    [{ type: "welcome", id: "welcome" }],
  ]);
  const hasLocalStorage = typeof localStorage !== "undefined";
  const hasWindow = typeof window !== "undefined";

  useEffect(() => {
    if (!settings.synchronize) {
      return;
    }

    axios
      .get(
        `https://local-storage-storage.io/api/portalific/${settings.identifier}`,
        {
          headers: { Authorization: "Bearer dslafki92esakflu8qfasdf" },
        }
      )
      .then((response) => {
        const data = JSON.parse(response.data.data);
        setRevision(response.data.revision);
        setModulesState(data.modules);
        setSettingsState(data.settings);
      });

    // We only want to run his effect once, actualy, when the localStorage is
    // available. We only read loaded, settings, and modules but don't care if
    // they (also) changed:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.synchronize]);

  useEffect(() => {
    // Update configuration from server, once the window gets focus
    if (!hasWindow || !settings.synchronize) {
      return;
    }

    window.addEventListener("focus", () => {
      axios
        .get(
          `https://local-storage-storage.io/api/portalific/${settings.identifier}`,
          {
            headers: { Authorization: "Bearer dslafki92esakflu8qfasdf" },
          }
        )
        .then((response) => {
          const data = JSON.parse(response.data.data);
          setRevision(response.data.revision);
          setModulesState(data.modules);
          setSettingsState(data.settings);
        });

      return () => {
        window.removeEventListener("focus");
      };
    });
    // We only want to run his effect once, actualy, when the window is
    // available. We only read loaded, settings, and modules but don't care if
    // they (also) changed:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasWindow]);

  const debouncedLocalStorageToServer = useDebouncedCallback(
    (settings, revision) => {
      if (!settings.synchronize) {
        setRevision(null);
        return;
      }

      if (!revision) {
        axios
          .put(
            `https://local-storage-storage.io/api/portalific/${settings.identifier}`,
            // @TODO: Encrypt data with settings.password
            JSON.stringify({
              modules: JSON.parse(localStorage.getItem("modules")),
              settings: JSON.parse(localStorage.getItem("settings")),
              theme: localStorage.getItem("theme"),
            }),
            {
              headers: { Authorization: "Bearer dslafki92esakflu8qfasdf" },
            }
          )
          .then((response) => {
            setRevision(response.data.revision);
          });
      } else {
        axios
          .post(
            `https://local-storage-storage.io/api/portalific/${settings.identifier}?revision=${revision}`,
            // @TODO: Encrypt data with settings.password
            JSON.stringify({
              modules: JSON.parse(localStorage.getItem("modules")),
              settings: JSON.parse(localStorage.getItem("settings")),
              theme: localStorage.getItem("theme"),
            }),
            {
              headers: { Authorization: "Bearer dslafki92esakflu8qfasdf" },
            }
          )
          .then((response) => {
            setRevision(response.data.revision);
          });
      }
    },
    1000
  );

  const debouncedModulesToLocalStorage = useDebouncedCallback((modules) => {
    localStorage.setItem("modules", JSON.stringify(modules));
    debouncedLocalStorageToServer(settings, revision);
  }, 1000);

  const setModules = (modules) => {
    setModulesState(modules);
    debouncedModulesToLocalStorage(modules);
  };

  const debouncedSettingsLocalStorage = useDebouncedCallback((settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
    debouncedLocalStorageToServer(settings, revision);
  }, 1000);

  const setSettings = (newSettings) => {
    // If the number of columns is reduced map all modules to the still
    // available columns
    if (newSettings.columns < settings.columns) {
      for (
        let column = newSettings.columns;
        column < settings.columns;
        column++
      ) {
        modules[newSettings.columns - 1] = (
          modules[newSettings.columns - 1] || []
        )
          .concat(modules[column])
          .filter((item) => !!item);
        modules[column] = [];
      }

      setModules(modules);
    }

    setSettingsState(newSettings);
    debouncedSettingsLocalStorage(newSettings);
  };

  const pushError = (error, errorInfo = null) => {
    setErrors([...errors, { error: error, info: errorInfo }]);
  };

  const moveModule = (sourceColumn, sourceIndex, targetColumn, targetIndex) => {
    const removedModule = modules[sourceColumn][sourceIndex];

    // Remove item from source column
    modules[sourceColumn].splice(sourceIndex, 1);

    // Put item into target column
    if (!Array.isArray(modules[targetColumn])) {
      modules[targetColumn] = [];
    }
    modules[targetColumn].splice(targetIndex, 0, removedModule);

    setModules([...modules]);
  };

  useEffect(() => {
    if (hasLocalStorage && !loaded) {
      setSettingsState(
        JSON.parse(localStorage.getItem("settings")) || settings
      );
      setModulesState(JSON.parse(localStorage.getItem("modules")) || modules);
      setLoaded(true);
    }

    // We only want to run his effect once, actualy, when the localStorage is
    // available. We only read loaded, settings, and modules but don't care if
    // they (also) changed:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLocalStorage]);

  // Dynamic class names: grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4
  const gridClassName = "lg:grid-cols-" + (settings.columns ?? 3);

  return (
    <Layout settings={settings}>
      <SEO title={globalData.name} description={globalData.description} />
      <Header
        name={globalData.name}
        modules={modules}
        setModules={setModules}
        moveModule={moveModule}
        settings={settings}
        setSettings={setSettings}
        errors={errors}
        clearErrors={() => setErrors([])}
      />
      <main className="w-full">
        <ul className={`${gridClassName} mb-6 grid w-full grid-cols-1 gap-6`}>
          {[...Array(+(settings.columns ?? 3)).keys()].map((column) => {
            return (
              <Column
                key={column}
                column={column}
                length={(modules[column] ?? []).length}
                moveModule={moveModule}
              >
                <ul>
                  {(modules[column] ?? []).map((module, index) => {
                    const ModuleComponent =
                      availableModules[module.type] ??
                      availableModules["notfound"];

                    return (
                      <Module
                        key={module.id}
                        id={module.id}
                        column={column}
                        index={index}
                        moveModule={moveModule}
                        hiddenOnDevices={module.hiddenOnDevices || []}
                      >
                        <ErrorBoundary pushError={pushError}>
                          <ModuleComponent
                            configuration={module}
                            updateModuleConfiguration={(configuration) => {
                              modules[column][index] = configuration;
                              setModules([...modules]);
                            }}
                            pushError={pushError}
                            settings={settings}
                            setSettings={setSettings}
                            modules={modules}
                            setModules={setModules}
                          />
                        </ErrorBoundary>
                      </Module>
                    );
                  })}
                </ul>
              </Column>
            );
          })}
        </ul>
      </main>
      <Footer copyrightText={globalData.footerText} />
    </Layout>
  );
}

export function getStaticProps() {
  return { props: {} };
}
