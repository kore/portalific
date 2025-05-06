import dynamic from 'next/dynamic'
import Column from '../components/Column'
import ErrorBoundary from '../components/ErrorBoundary'
import Module from '../components/Module'
import NotFound from '../modules/NotFound'
import Welcome from '../modules/Welcome'
import useStore from '../utils/store'

const availableModules = {
  clock: dynamic(() => import('../modules/Clock')),
  countdown: dynamic(() => import('../modules/Countdown')),
  feed: dynamic(() => import('../modules/Feed')),
  calendar: dynamic(() => import('../modules/Calendar')),
  todo: dynamic(() => import('../modules/TodoList')),
  webStats: dynamic(() => import('../modules/WebStats')),
  welcome: Welcome,
  notfound: NotFound,
}

export default function Modules ({ state, moduleRenderer = null }) {

  const moveModule = (sourceColumn, sourceIndex, targetColumn, targetIndex) => {
    let modules = [...state.modules]
    const removedModule = modules[sourceColumn][sourceIndex]

    // Remove item from source column
    modules[sourceColumn].splice(sourceIndex, 1)

    // Put item into target column
    if (!Array.isArray(modules[targetColumn])) {
      modules[targetColumn] = []
    }
    modules[targetColumn].splice(targetIndex, 0, removedModule)

    state.setModules(modules)
  }

  const gridClassName = 'grid__cols-' + (state.settings.columns ?? 3)

  console.log(state.modules)

  return (
    <ul className={`grid ${gridClassName}`}>
      {[...Array(+(state.settings.columns ?? 3)).keys()].map((column) => {
        return (
          <Column
            key={column}
            column={column}
            length={(state.modules[column] ?? []).length}
            moveModule={moveModule}
          >
            <ul className='modules'>
              {(state.modules[column] ?? []).map((module, index) => {
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
                    <ErrorBoundary pushError={state.pushError}>
                      {moduleRenderer
                        ? (
                            moduleRenderer(module, index)
                          )
                        : (
                          <ModuleComponent
                            state={state}
                            configuration={module}
                            updateModuleConfiguration={(configuration) => {
                              state.modules[column][index] = configuration
                              setModules([...state.modules])
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
