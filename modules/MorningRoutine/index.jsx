import { useEffect, useRef, useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

const ROUTINES = {
  A: {
    label: 'Routine A',
    schedule: 'Mon · Wed · Fri',
    description: 'Focus: release hip flexors + activate glutes.',
    steps: [
      {
        name: 'Cat–Cow',
        detail: 'On all fours, roll vertebra by vertebra. Slow, following your breath – inhale = arch, exhale = round the back.',
        reps: 1,
        repTime: 90,
        pause: 0
      },
      {
        name: '90/90 Hip Stretch',
        detail: 'Seated, both knees at 90°, front leg outside, back leg inside. Sit upright, lean slightly forward. One rep per side.',
        reps: 2,
        repTime: 45,
        pause: 10
      },
      {
        name: 'Couch Stretch (Psoas)',
        detail: 'Back knee on the floor, front foot in front of you. Tilt the pelvis slightly, squeeze the glutes. One rep per side, stay upright.',
        reps: 2,
        repTime: 45,
        pause: 10
      },
      {
        name: 'Glute Bridge',
        detail: 'On your back, feet hip-width apart. Squeeze the glutes, lift the hips, hold 3 sec, lower with control. Push the knees slightly outward. 10× per set.',
        reps: 3,
        repTime: 30,
        pause: 15
      },
      {
        name: 'Bird Dog',
        detail: 'On all fours: extend the opposite arm-leg pair, hold 2 sec. Keep the core stable, no arching. 8× per set.',
        reps: 3,
        repTime: 30,
        pause: 15
      },
      {
        name: "World's Greatest Stretch",
        detail: 'Lunge, front hand next to the foot, then rotate the arm toward the ceiling. 3–4 reps per side, flowing movement.',
        reps: 2,
        repTime: 60,
        pause: 0
      }
    ]
  },
  B: {
    label: 'Routine B',
    schedule: 'Tue · Thu',
    description: 'Focus: mobilize the thoracic spine + lateral core stability.',
    steps: [
      {
        name: 'Puppy Pose',
        detail: 'Kneeling, walk the hands far forward, hips above the knees. Let the chest sink toward the floor, arms stretched. Breathe into the upper back, no lumbar arching.',
        reps: 1,
        repTime: 90,
        pause: 0
      },
      {
        name: 'Thoracic Rotation (floor)',
        detail: 'Side-lying, knees bent at 90°. Bring the top arm to the ceiling and behind you toward the floor, eyes following. 8× per side, slow.',
        reps: 2,
        repTime: 60,
        pause: 10
      },
      {
        name: 'Thread the Needle',
        detail: 'On all fours, thread one arm under the body, shoulder toward the floor. Hold briefly, return, rotate. 6–8× per side.',
        reps: 2,
        repTime: 45,
        pause: 10
      },
      {
        name: 'Side Plank (static)',
        detail: 'On the forearm or hand, body in a straight line. Do not let the hips sag. Alternate sides.',
        reps: 6,
        repTime: 20,
        pause: 10
      },
      {
        name: 'Hip CARs (hip circles)',
        detail: 'Standing or on all fours, slowly circle one leg through its full range – fully active and controlled. 5 slow circles per side.',
        reps: 2,
        repTime: 60,
        pause: 10
      },
      {
        name: 'Standing Side Bend + Rotation',
        detail: 'Stand upright, arms relaxed. First bend side to side, then rotate slowly. 8–10× per direction.',
        reps: 1,
        repTime: 90,
        pause: 0
      }
    ]
  }
}

const WEEKDAY_TO_ROUTINE = { 1: 'A', 2: 'B', 3: 'A', 4: 'B', 5: 'A' }

const todayKey = (date) => date.toISOString().slice(0, 10)

const stepDuration = (step) =>
  step.reps * step.repTime + (step.reps - 1) * step.pause

const routineDuration = (routine) =>
  routine.steps.reduce((sum, step) => sum + stepDuration(step), 0)

const formatTiming = (step) =>
  (step.reps > 1 ? step.reps + ' × ' : '') +
  step.repTime + ' sec' +
  (step.reps > 1 && step.pause > 0 ? ' · ' + step.pause + ' sec pause' : '')

const formatCountdown = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  return minutes + ':' + String(seconds % 60).padStart(2, '0')
}

// Short synthesized beeps via the Web Audio API – no audio assets needed. The
// context is created lazily on the first (user-gesture-triggered) sound, which
// keeps the browser autoplay policy happy.
let audioContext = null

const beep = (frequency, duration, delay = 0) => {
  try {
    audioContext = audioContext ?? new (window.AudioContext || window.webkitAudioContext)()
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    const start = audioContext.currentTime + delay
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    // Hold the volume and only fade out over the last 150 ms.
    gain.gain.setValueAtTime(0.2, start)
    gain.gain.setValueAtTime(0.2, start + Math.max(0, duration - 0.15))
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
    oscillator.connect(gain).connect(audioContext.destination)
    oscillator.start(start)
    oscillator.stop(start + duration)
  } catch {
    // Sound is non-essential – ignore environments without Web Audio.
  }
}

const repStartSound = () => beep(880, 0.9, 0.25)
const repEndSound = () => beep(440, 0.3)

export default function MorningRoutine ({ configuration, updateModuleConfiguration }) {
  const [now, setNow] = useState(() => new Date())
  // null = overview; otherwise
  // { routine, step, rep, phase: 'exercise' | 'pause', remaining }
  const [run, setRun] = useState(null)
  const completions = configuration.completions ?? {}

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const routineKey = WEEKDAY_TO_ROUTINE[now.getDay()]
  const dateKey = todayKey(now)

  // Routines completed today; reads the legacy { routine, done } shape too.
  const completedRoutines = (entry) =>
    entry?.routines ?? (entry?.done && entry?.routine ? [entry.routine] : [])

  const completedToday = (key) => completedRoutines(completions[dateKey]).includes(key)
  const overdue = routineKey && !completedToday(routineKey) && now.getHours() >= 11

  const setCompleted = (key, value) => {
    const routines = new Set(completedRoutines(completions[dateKey]))
    routines[value ? 'add' : 'delete'](key)

    const merged = {
      ...completions,
      [dateKey]: { routines: [...routines] }
    }

    // Keep only the most recent 256 days so the synced configuration does not
    // grow without bound.
    const next = Object.fromEntries(
      Object.keys(merged)
        .sort()
        .slice(-256)
        .map((key) => [key, merged[key]])
    )

    updateModuleConfiguration({ ...configuration, completions: next })
  }

  const finishRun = () => {
    // Completing a full routine marks it as done for today.
    setCompleted(run.routine, true)
    setRun(null)
  }

  const skipToNextExercise = () => {
    const steps = ROUTINES[run.routine].steps
    const nextStep = run.step + 1

    if (nextStep >= steps.length) {
      finishRun()
      return
    }

    setRun({
      ...run,
      step: nextStep,
      rep: 1,
      phase: 'exercise',
      remaining: steps[nextStep].repTime
    })
  }

  const skipToNextRep = () => {
    const step = ROUTINES[run.routine].steps[run.step]

    if (run.rep < step.reps) {
      setRun({ ...run, rep: run.rep + 1, phase: 'exercise', remaining: step.repTime })
    } else {
      skipToNextExercise()
    }
  }

  // Play a low beep when a rep ends and a high beep when one starts, for any
  // transition – timer tick, skip button, or routine start/finish alike.
  const previousRun = useRef(null)
  useEffect(() => {
    const before = previousRun.current
    previousRun.current = run

    const repChanged =
      !before !== !run ||
      (before && run && (
        before.routine !== run.routine ||
        before.step !== run.step ||
        before.rep !== run.rep ||
        before.phase !== run.phase
      ))

    if (!repChanged) {
      return
    }

    if (before?.phase === 'exercise') {
      repEndSound()
    }
    if (run?.phase === 'exercise') {
      repStartSound()
    }
  }, [run])

  useEffect(() => {
    if (!run) {
      return
    }

    const timeout = setTimeout(() => {
      if (run.remaining > 1) {
        setRun({ ...run, remaining: run.remaining - 1 })
        return
      }

      const step = ROUTINES[run.routine].steps[run.step]

      if (run.phase === 'pause') {
        setRun({ ...run, rep: run.rep + 1, phase: 'exercise', remaining: step.repTime })
        return
      }

      if (run.rep < step.reps) {
        if (step.pause > 0) {
          setRun({ ...run, phase: 'pause', remaining: step.pause })
        } else {
          setRun({ ...run, rep: run.rep + 1, phase: 'exercise', remaining: step.repTime })
        }
        return
      }

      skipToNextExercise()
    }, 1000)

    return () => clearTimeout(timeout)
  }, [run])

  const startRoutine = (key) => {
    setRun({
      routine: key,
      step: 0,
      rep: 1,
      phase: 'exercise',
      remaining: ROUTINES[key].steps[0].repTime
    })
  }

  if (run) {
    const runRoutine = ROUTINES[run.routine]
    const step = runRoutine.steps[run.step]

    return (
      <div className='morning-routine'>
        <div className='morning-routine__header'>
          <h3 className='morning-routine__title'>{runRoutine.label}</h3>
          <span className='morning-routine__schedule'>{runRoutine.schedule}</span>
        </div>
        <div className='morning-routine__runner'>
          <div className='morning-routine__runner-header'>
            <span className='morning-routine__progress'>
              {(run.step + 1) + '/' + runRoutine.steps.length}
            </span>
            <span
              className={'morning-routine__phase' + (run.phase === 'pause' ? ' morning-routine__phase--pause' : '')}
            >
              {run.phase === 'pause' ? 'Pause' : 'Exercise'}
            </span>
          </div>
          <h4 className='morning-routine__exercise-name'>{step.name}</h4>
          <p className='morning-routine__description'>{step.detail}</p>
          <p className='morning-routine__timing'>
            {formatTiming(step)}
            {step.reps > 1 ? ' · Rep ' + run.rep + '/' + step.reps : ''}
          </p>
          <div
            className={'morning-routine__countdown' + (run.phase === 'pause' ? ' morning-routine__countdown--pause' : '')}
          >
            {formatCountdown(run.remaining)}
          </div>
          <div className='morning-routine__controls'>
            {run.rep < step.reps
              ? (
                <button
                  type='button'
                  className='button button--secondary morning-routine__next-rep'
                  onClick={skipToNextRep}
                >
                  Next rep
                </button>
                )
              : null}
            <button
              type='button'
              className='button button--secondary morning-routine__done'
              onClick={skipToNextExercise}
            >
              {run.step + 1 >= runRoutine.steps.length
                ? 'Done'
                : 'Done – next exercise'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='morning-routine'>
      <ul className='morning-routine__list'>
        {Object.entries(ROUTINES)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, routine]) => (
            <li
              className={'morning-routine__routine' + (key !== routineKey ? ' morning-routine__routine--muted' : '')}
              key={'routine-' + key}
              title={routine.description}
            >
              <span className='morning-routine__title'>{routine.label}</span>
              <span className='morning-routine__schedule'>{routine.schedule}</span>
              {key === routineKey && overdue
                ? (
                  <span
                    className='morning-routine__diode'
                    title='Not done yet – already past 11:00'
                    aria-label='Routine overdue'
                  />
                  )
                : null}
              {completedToday(key)
                ? (
                  <button
                    type='button'
                    className='morning-routine__check'
                    onClick={() => setCompleted(key, false)}
                    title='Done today – mark as not done'
                    aria-label='Done today – mark as not done'
                  >
                    <CheckCircleIcon className='morning-routine__check-icon' aria-hidden='true' />
                  </button>
                  )
                : (
                  <button
                    type='button'
                    className='button button--primary morning-routine__start'
                    onClick={() => startRoutine(key)}
                  >
                    Start · {routine.steps.length} exercises · ~{Math.round(routineDuration(routine) / 60)} min
                  </button>
                  )}
            </li>
          ))}
      </ul>
    </div>
  )
}
