import { useEffect, useRef } from 'react'

export default function Modal ({ open, setOpen, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) {
      return
    }

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      className='modal'
      ref={ref}
      onClose={() => setOpen(false)}
      onClick={(event) => {
        // Close when the backdrop (the dialog element itself) is clicked.
        if (event.target === ref.current) {
          setOpen(false)
        }
      }}
    >
      <div className='modal-body'>{children}</div>

      <footer className='modal-actions'>
        <button
          type='button'
          className='button'
          data-variant='primary'
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </footer>
    </dialog>
  )
}
