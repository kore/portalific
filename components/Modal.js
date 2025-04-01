import { Dialog } from "@headlessui/react";

export default function Modal({ open, setOpen, children, settings }) {
  return (
    <Dialog
      as="div"
      className={`modal theme--${settings.theme}`}
      open={open}
      onClose={setOpen}
    >
      <Dialog.Panel className="modal__content">
        <div className="modal__body">{children}</div>

        <div className="modal__footer">
          <button
            type="button"
            className="button button--primary"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
