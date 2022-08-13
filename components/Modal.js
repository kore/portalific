import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({ open, setOpen, children }) {
  console.log("Dialog", open);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div className="divide-y divide-gray-200 pt-6 dark:divide-gray-600">
                  {children}
                </div>

                <div className="mt-5 text-right sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
