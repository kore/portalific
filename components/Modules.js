import dynamic from 'next/dynamic'
import Column from '../components/Column'
import ErrorBoundary from '../components/ErrorBoundary'
import Module from '../components/Module'
import NotFound from '../modules/NotFound'
import Welcome from '../modules/Welcome'
import useStore from '../utils/store'
import { useShallow } from 'zustand/react/shallow'

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

export default function Modules ({ moduleRenderer = null }) {
  const [settings, modules, setModules, moveModule, pushError] = useStore(useShallow((store) => [store.settings, store.modules, store.setModules, store.moveModule, store.pushError]))
  const gridClassName = 'grid__cols-' + (settings.columns ?? 3)

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
            <ul className='modules'>
              {(modules[column] ?? []).map((module, index) => {
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
                    <ErrorBoundary pushError={pushError}>
                      {moduleRenderer
                        ? (
                            moduleRenderer(module, index)
                          )
                        : (
                          <ModuleComponent
                            configuration={module}
                            updateModuleConfiguration={(configuration) => {
                              modules[column][index] = configuration
                              setModules([...modules])
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
