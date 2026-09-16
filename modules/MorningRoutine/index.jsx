import { useEffect, useRef, useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

const ROUTINES = {
  A: {
    label: 'Daily Back A',
    schedule: 'Mo, We, Fr',
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
    label: 'Daily Back B',
    schedule: 'Tue, Thu',
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
  },
  S: {
    label: 'Strength',
    schedule: 'Mo, Thu',
    description: 'Full-body strength (You Are Your Own Gym): 4 combos – 4× upper body, 2× legs, 2× core – 3 rounds of 4 minutes each. Rotating exercises, 1–3 reps left in reserve.',
    steps: [] // Rotated per session from the STRENGTH pools below.
  }
}

// Exercise pools in the style of "You Are Your Own Gym" – everything works
// with stall bars, dip bars and a pull-up bar, no weights. Each Strength day
// takes 4 upper body, 2 legs and 2 core exercises, paired into 4 combos.
//
// The rep targets are sized so that the *third* round still leaves one to
// three clean reps in reserve – not so that the first round is maximal.
// Training every set to momentary failure buys no extra hypertrophy and is
// paid for with worse technique and a longer recovery need.
const STRENGTH = {
  upper: [
    { name: 'One-Arm Push-Ups', task: '4 one-arm push-ups per side, feet wide, body tight' },
    { name: 'Pull-Ups', task: '5 pull-ups, overhand grip' },
    { name: 'Chin-Ups', task: '6 chin-ups, underhand grip, chest to the bar' },
    { name: 'Dips', task: '8 dips on the dip bars, slight forward lean, full range' },
    { name: 'Military Press', task: '6 military presses with feet raised on the stall bars, or handstand push-ups' },
    { name: 'Door Rows', task: '10 door rows (bodyweight rows pulling on a door)' },
    { name: 'Let Me Ups', task: '8 horizontal rows hanging under a low rung of the stall bars, body straight' },
    { name: 'Dive Bombers', task: '6 dive bomber push-ups, flowing through the whole movement' },
    { name: 'Close-Grip Push-Ups', task: '8 push-ups with hands close together, elbows tucked' }
  ],
  legs: [
    { name: 'Pistol Squats', task: '4 single-leg squats per side, hold a rung of the stall bars for balance if needed' },
    { name: 'Bulgarian Split Squats', task: '8 split squats per side, rear foot on a low rung of the stall bars' },
    { name: 'Iron Mikes', task: '10 alternating jumping lunges' },
    { name: 'Single-Leg Romanian Deadlifts', task: '8 single-leg deadlifts per side, slow and controlled' },
    { name: 'Squat Jumps', task: '10 deep squat jumps, soft landings' }
  ],
  core: [
    { name: 'V-Ups', task: '10 V-ups' },
    { name: 'Bicycles', task: '20 bicycle crunches' },
    { name: 'Hanging Leg Raises', task: '8 hanging leg raises on the pull-up bar, toes toward the bar' },
    { name: 'Windshield Wipers', task: '8 windshield wipers, hanging from the bar or on the floor' }
  ]
}

// Strength days rotate through the pools instead of drawing from them at
// random. The pools are small enough that random draws repeat the movement
// patterns anyway, but they repeat *unevenly* – an exercise can land twice in
// one week and then not show up for twelve days. A fixed cadence keeps the
// stimulus per pattern even and makes progress readable: if dips come up every
// nine sessions, "more reps than last time" is a meaningful comparison.
//
// Sessions are counted from a fixed Monday so the rotation depends only on the
// date, never on how many routines were actually completed.
const EPOCH_MONDAY_DAY = 4 // 1970-01-01 was a Thursday, so day 4 is a Monday.
const MS_PER_DAY = 24 * 60 * 60 * 1000

const sessionIndex = (date) => {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY) - EPOCH_MONDAY_DAY
  const week = Math.floor(day / 7)
  // Within the week Monday is 0 and Thursday is 3 – the two Strength days.
  return week * 2 + (((day % 7) + 7) % 7 >= 3 ? 1 : 0)
}

// Takes `count` consecutive entries starting at `index * count`, wrapping
// around. With 9 upper and 5 leg exercises the take counts are coprime to the
// pool sizes, so every exercise comes up equally often; the 4 core exercises
// alternate as two fixed pairs, which still means all four every week.
const rotate = (pool, count, index) =>
  Array.from({ length: count }, (_, offset) => pool[(index * count + offset) % pool.length])

const strengthCombo = (first, second) => ({
  name: first.name + ' + ' + second.name,
  detail: first.task + ', then ' + second.task + '. Leave 1–3 clean reps in reserve – stop short of failure. Rest within the remaining time of the round.',
  reps: 3,
  repTime: 240,
  pause: 0
})

const strengthSteps = (date) => {
  const index = sessionIndex(date)
  const upper = rotate(STRENGTH.upper, 4, index)
  const legs = rotate(STRENGTH.legs, 2, index)
  const core = rotate(STRENGTH.core, 2, index)

  return [
    strengthCombo(upper[0], legs[0]),
    strengthCombo(upper[1], legs[1]),
    strengthCombo(upper[2], core[0]),
    strengthCombo(upper[3], core[1])
  ]
}

// Seconds of "get ready" before each exercise block, giving time to read the
// description and get into position before the rep starts.
const PREPARE_TIME = 10

const WEEKDAY_TO_ROUTINES = {
  1: ['A', 'S'],
  2: ['B'],
  3: ['A'],
  4: ['B', 'S'],
  5: ['A']
}

const todayKey = (date) => date.toISOString().slice(0, 10)

const stepDuration = (step) =>
  step.reps * step.repTime + (step.reps - 1) * step.pause

const routineDuration = (routine) =>
  routine.steps.reduce((sum, step) => sum + PREPARE_TIME + stepDuration(step), 0)

const formatRepTime = (seconds) =>
  seconds >= 60 && seconds % 60 === 0 ? seconds / 60 + ' min' : seconds + ' sec'

const formatTiming = (step) =>
  (step.reps > 1 ? step.reps + ' × ' : '') +
  formatRepTime(step.repTime) +
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

  const todayRoutines = WEEKDAY_TO_ROUTINES[now.getDay()] ?? []
  const plannedToday = (key) => todayRoutines.includes(key)
  const dateKey = todayKey(now)

  // Today's routines, with the Strength steps rotated in for this session.
  const routines = { ...ROUTINES, S: { ...ROUTINES.S, steps: strengthSteps(now) } }

  // Routines completed today; reads the legacy { routine, done } shape too.
  const completedRoutines = (entry) =>
    entry?.routines ?? (entry?.done && entry?.routine ? [entry.routine] : [])

  const completedToday = (key) => completedRoutines(completions[dateKey]).includes(key)
  const overdueToday = (key) =>
    plannedToday(key) && !completedToday(key) && now.getHours() >= 11

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
    const steps = routines[run.routine].steps
    const nextStep = run.step + 1

    if (nextStep >= steps.length) {
      finishRun()
      return
    }

    setRun({
      ...run,
      step: nextStep,
      rep: 1,
      phase: 'prepare',
      remaining: PREPARE_TIME
    })
  }

  const skipToNextRep = () => {
    const step = routines[run.routine].steps[run.step]

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

      const step = routines[run.routine].steps[run.step]

      if (run.phase === 'prepare') {
        setRun({ ...run, phase: 'exercise', remaining: step.repTime })
        return
      }

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
      phase: 'prepare',
      remaining: PREPARE_TIME
    })
  }

  if (run) {
    const runRoutine = routines[run.routine]
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
              className={'morning-routine__phase' + (run.phase === 'pause' ? ' morning-routine__phase--pause' : run.phase === 'prepare' ? ' morning-routine__phase--prepare' : '')}
            >
              {run.phase === 'pause' ? 'Pause' : run.phase === 'prepare' ? 'Get ready' : 'Exercise'}
            </span>
          </div>
          <h4 className='morning-routine__exercise-name'>{step.name}</h4>
          <p className='morning-routine__description'>{step.detail}</p>
          <p className='morning-routine__timing'>
            {formatTiming(step)}
            {step.reps > 1 ? ' · Rep ' + run.rep + '/' + step.reps : ''}
          </p>
          <div
            className={'morning-routine__countdown' + (run.phase === 'pause' ? ' morning-routine__countdown--pause' : run.phase === 'prepare' ? ' morning-routine__countdown--prepare' : '')}
          >
            {formatCountdown(run.remaining)}
          </div>
          <div className='morning-routine__controls'>
            {run.phase === 'exercise' && run.rep < step.reps
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
        {Object.entries(routines)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, routine]) => (
            <li
              className={'morning-routine__routine' + (!plannedToday(key) ? ' morning-routine__routine--muted' : '')}
              key={'routine-' + key}
              title={routine.description}
            >
              <span className='morning-routine__title'>{routine.label}</span>
              <span className='morning-routine__schedule'>{routine.schedule}</span>
              {overdueToday(key)
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
                    Start · ~{Math.round(routineDuration(routine) / 60)} min
                  </button>
                  )}
            </li>
          ))}
      </ul>
    </div>
  )
}
