import dynamic from "next/dynamic";
import Column from "../components/Column";
import ErrorBoundary from "../components/ErrorBoundary";
import Module from "../components/Module";
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

export default function Modules({
  pushError,
  setSettings,
  settings,
  modules,
  setModules,
  moduleRenderer = null,
}) {
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

  const gridClassName = "grid__cols-" + (settings.columns ?? 3);

  return (
    <ul className={`grid ${gridClassName}`}>
      {[...Array(+(settings.columns ?? 3)).keys()].map((column) => {
        return (
          <Column
            key={column}
            column={column}
            length={(modules[column] ?? []).length}
            moveModule={moveModule}
          >
            <ul className="modules">
              {(modules[column] ?? []).map((module, index) => {
                const ModuleComponent =
                  availableModules[module.type] ?? availableModules["notfound"];

                return (
                  <Module
                    key={module.id}
                    type={module.type}
                    id={module.id}
                    column={column}
                    index={index}
                    moveModule={moveModule}
                    hiddenOnDevices={module.hiddenOnDevices || []}
                  >
                    <ErrorBoundary pushError={pushError}>
                      {moduleRenderer ? (
                        moduleRenderer(module, index)
                      ) : (
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
                      )}
                    </ErrorBoundary>
                  </Module>
                );
              })}
            </ul>
          </Column>
        );
      })}
    </ul>
  );
}
