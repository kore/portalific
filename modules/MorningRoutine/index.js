import { useEffect, useState } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

const ROUTINES = {
  A: {
    label: 'Routine A',
    schedule: 'Mo · Mi · Fr',
    description: 'Fokus: Hüftbeuger lösen + Gesäß aktivieren.',
    steps: [
      {
        name: 'Katze–Kuh',
        detail: 'Auf allen Vieren, Wirbel für Wirbel rollen. Langsam, mit Atemrhythmus – Einatmen = Hohlkreuz, Ausatmen = Rundrücken.',
        time: '90 Sek'
      },
      {
        name: '90/90 Hip Stretch',
        detail: 'Im Sitzen beide Knie im 90°-Winkel, vorderes Bein außen, hinteres innen. Aufrecht sitzen, leicht nach vorne lehnen. Seite wechseln nach 45 Sek.',
        time: '90 Sek'
      },
      {
        name: 'Couch Stretch (Psoas)',
        detail: 'Hinteres Knie am Boden, vorderer Fuß vor dir. Becken leicht kippen, Gesäß anspannen. Je Seite 45 Sek, dabei aufrecht bleiben.',
        time: '90 Sek'
      },
      {
        name: 'Glute Bridge',
        detail: 'Rücken am Boden, Füße hüftbreit. Gesäß fest anspannen, Hüfte hoch, 3 Sek halten, kontrolliert runter. Knie leicht nach außen drücken.',
        time: '2 Min (3×10)'
      },
      {
        name: 'Bird Dog',
        detail: 'Auf allen Vieren: gegenüberliegendes Arm-Bein-Paar strecken, 2 Sek halten. Kern stabil halten, kein Hohlkreuz.',
        time: '2 Min (je 8×)'
      },
      {
        name: 'Weltgrößte Dehnung',
        detail: 'Ausfallschritt, vordere Hand neben Fuß, dann Arm zur Decke drehen. 3–4 Wiederholungen pro Seite, fließende Bewegung.',
        time: '2 Min'
      }
    ]
  },
  B: {
    label: 'Routine B',
    schedule: 'Di · Do',
    description: 'Fokus: Brustwirbelsäule mobilisieren + seitliche Rumpfstabilität.',
    steps: [
      {
        name: 'Thoracic Foam Roll',
        detail: 'Rolle quer unter die Brustwirbelsäule, Hände hinter Kopf. Segmentweise von BWS-Mitte bis Schulterblätter rollen. Kein LWS-Rollen.',
        time: '90 Sek'
      },
      {
        name: 'Thoracic Rotation (Boden)',
        detail: 'Seitenlage, Knie 90° angewinkelt. Oberen Arm zur Decke und dahinter Richtung Boden führen, Augen folgen. Je Seite 8×, langsam.',
        time: '2 Min'
      },
      {
        name: 'Thread the Needle',
        detail: 'Auf allen Vieren, einen Arm unter dem Körper einfädeln, Schulter zum Boden. Kurz halten, zurück, drehen. Je Seite 6–8×.',
        time: '90 Sek'
      },
      {
        name: 'Side Plank (statisch)',
        detail: 'Auf Unterarm oder Hand, Körper gerade Linie. Hüfte nicht hängen lassen. Je Seite 3×20 Sek mit kurzer Pause.',
        time: '2 Min'
      },
      {
        name: 'Hip CARs (Hüftkreisen)',
        detail: 'Stehend oder auf allen Vieren, ein Bein in maximaler Amplitude langsam kreisen lassen – vollständig aktiv kontrolliert. Je Seite 5 langsame Kreise.',
        time: '2 Min'
      },
      {
        name: 'Stehende Seitneigung + Rotation',
        detail: 'Aufrecht stehen, Arme locker. Erst Seite zu Seite neigen, dann langsam rotieren. 8–10× je Richtung.',
        time: '90 Sek'
      }
    ]
  }
}

const WEEKDAY_TO_ROUTINE = { 1: 'A', 2: 'B', 3: 'A', 4: 'B', 5: 'A' }

const STORAGE_KEY_PREFIX = 'morning-routine-'

const hasLocalStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const loadCompletions = (id) => {
  if (!hasLocalStorage()) return {}
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY_PREFIX + id)) ?? {}
  } catch {
    return {}
  }
}

const saveCompletions = (id, data) => {
  if (!hasLocalStorage()) return
  window.localStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify(data))
}

const todayKey = (date) => date.toISOString().slice(0, 10)

export default function MorningRoutine ({ configuration }) {
  const [now, setNow] = useState(() => new Date())
  const [completions, setCompletions] = useState({})

  useEffect(() => {
    setCompletions(loadCompletions(configuration.id))
  }, [configuration.id])

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const routineKey = WEEKDAY_TO_ROUTINE[now.getDay()]

  if (!routineKey) {
    return (
      <div className='morning-routine'>
        <div className='morning-routine__header'>
          <h3 className='morning-routine__title'>Ruhetag</h3>
          <span className='morning-routine__schedule'>Sa · So</span>
        </div>
        <p className='morning-routine__description'>Heute keine Morgenroutine geplant.</p>
      </div>
    )
  }

  const routine = ROUTINES[routineKey]
  const dateKey = todayKey(now)
  const done = !!completions[dateKey]?.done
  const overdue = !done && now.getHours() >= 11

  const toggleDone = () => {
    const next = {
      ...completions,
      [dateKey]: { routine: routineKey, done: !done }
    }
    setCompletions(next)
    saveCompletions(configuration.id, next)
  }

  const ToggleIcon = done ? XCircleIcon : CheckCircleIcon
  const toggleLabel = done ? 'Als nicht erledigt markieren' : 'Als erledigt markieren'

  return (
    <div className='morning-routine'>
      <div className='morning-routine__header'>
        <button
          type='button'
          className={'morning-routine__toggle' + (done ? ' morning-routine__toggle--done' : '')}
          onClick={toggleDone}
          title={toggleLabel}
          aria-label={toggleLabel}
        >
          <ToggleIcon className='morning-routine__toggle-icon' aria-hidden='true' />
        </button>
        <h3 className='morning-routine__title'>{routine.label}</h3>
        <span className='morning-routine__schedule'>{routine.schedule}</span>
        {overdue
          ? (
            <span
              className='morning-routine__diode'
              title='Noch nicht erledigt – schon nach 11:00'
              aria-label='Routine überfällig'
            />
            )
          : null}
      </div>
      {done
        ? null
        : (
          <p className='morning-routine__description'>{routine.description}</p>
          )}
      {done
        ? null
        : (
          <ul className='todo-list'>
            {routine.steps.map((step, idx) => (
              <li className='todo-list__item' key={'step-' + idx} title={step.detail}>
                <div className='todo-list__content'>
                  <p className='todo-list__text'>{step.name}</p>
                </div>
                <div className='todo-list__due-date'>
                  <span className='todo-list__due-date-text'>{step.time}</span>
                </div>
              </li>
            ))}
          </ul>
          )}
    </div>
  )
}
