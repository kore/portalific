import { lazy, Suspense } from 'react'
import Column from '../components/Column'
import ErrorBoundary from '../components/ErrorBoundary'
import Module from '../components/Module'
import NotFound from '../modules/NotFound'
import Welcome from '../modules/Welcome'
import useStore from '../utils/store'
import { useShallow } from 'zustand/react/shallow'

const availableModules = {
  clock: lazy(() => import('../modules/Clock')),
  countdown: lazy(() => import('../modules/Countdown')),
  feed: lazy(() => import('../modules/Feed')),
  calendar: lazy(() => import('../modules/Calendar')),
  todo: lazy(() => import('../modules/TodoList')),
  morningRoutine: lazy(() => import('../modules/MorningRoutine')),
  webStats: lazy(() => import('../modules/WebStats')),
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
              {(modules[column] ?? []).filter((module) => module && module.type).map((module, index) => {
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
                      <Suspense fallback={null}>
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
                      </Suspense>
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
