import dynamic from 'next/dynamic'
import Column from '../components/Column'
import ErrorBoundary from '../components/ErrorBoundary'
import Module from '../components/Module'
import NotFound from '../modules/NotFound'
import Welcome from '../modules/Welcome'

const availableModules = {
  clock: dynamic(() => import('../modules/Clock')),
  countdown: dynamic(() => import('../modules/Countdown')),
  feed: dynamic(() => import('../modules/Feed')),
  calendar: dynamic(() => import('../modules/Calendar')),
  todo: dynamic(() => import('../modules/TodoList')),
  webStats: dynamic(() => import('../modules/WebStats')),
  welcome: Welcome,
  notfound: NotFound
}

export default function Modules ({ store, moduleRenderer = null }) {
  const moveModule = (sourceColumn, sourceIndex, targetColumn, targetIndex) => {
    const modules = [...store.modules]
    const removedModule = modules[sourceColumn][sourceIndex]

    // Remove item from source column
    modules[sourceColumn].splice(sourceIndex, 1)

    // Put item into target column
    if (!Array.isArray(modules[targetColumn])) {
      modules[targetColumn] = []
    }
    modules[targetColumn].splice(targetIndex, 0, removedModule)

    store.setModules(modules)
  }

  const gridClassName = 'grid__cols-' + (store.settings.columns ?? 3)

  return (
    <ul className={`grid ${gridClassName}`}>
      {[...Array(+(store.settings.columns ?? 3)).keys()].map((column) => {
        return (
          <Column
            key={column}
            column={column}
            length={(store.modules[column] ?? []).length}
            moveModule={moveModule}
          >
            <ul className='modules'>
              {(store.modules[column] ?? []).map((module, index) => {
                const ModuleComponent =
                  availableModules[module.type] ?? availableModules.notfound

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
                    <ErrorBoundary pushError={store.pushError}>
                      {moduleRenderer
                        ? (
                            moduleRenderer(module, index)
                          )
                        : (
                          <ModuleComponent
                            store={store}
                            configuration={module}
                            updateModuleConfiguration={(configuration) => {
                              store.modules[column][index] = configuration
                              store.setModules([...store.modules])
                            }}
                          />
                          )}
                    </ErrorBoundary>
                  </Module>
                )
              })}
            </ul>
          </Column>
        )
      })}
    </ul>
  )
}
