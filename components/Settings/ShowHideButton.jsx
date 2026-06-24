import { XCircleIcon } from '@heroicons/react/24/outline'

export default function ShowHideButton ({ hidden, onClick, children }) {
  return (
    <button
      type='button'
      data-hidden={hidden || undefined}
      aria-pressed={hidden}
      onClick={() => onClick(!hidden)}
    >
      {hidden && <XCircleIcon className='overlay-icon' aria-hidden='true' />}
      {children}
    </button>
  )
}
