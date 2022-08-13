import { Fragment, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CountdownConfiguration({
  configuration,
  setConfiguration,
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  return (
    <Fragment>
      {/* Main section */}
      <div className="divide-y divide-gray-200 pt-6 dark:divide-gray-600">
        <div className="px-4 sm:px-6">
          <div>
            <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
              Countdown
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              Configure countdowns for certain events.
            </p>
          </div>
          <ul
            role="list"
            className="mt-2 divide-y divide-gray-200 dark:divide-gray-600"
          >
            {(configuration.countdowns ?? []).map((countdown) => {
              return (
                <li
                  className="grid grid-cols-12 gap-4 pt-4"
                  key={countdown.name}
                >
                  <div className="col-span-7">{countdown.name}</div>
                  <div className="col-span-4">{countdown.date}</div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      className="ml-1 shrink-0 rounded-full p-1 text-primary-200 hover:bg-primary-800 hover:text-white focus:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
                      onClick={() => {
                        setConfiguration(
                          "countdowns",
                          (configuration.countdowns ?? []).filter(
                            (toFilter) => toFilter.name !== countdown.name
                          )
                        );
                      }}
                    >
                      <span className="sr-only">Delete countdown</span>
                      <TrashIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
            <li className="grid grid-cols-12 gap-4 pt-4">
              <div className="col-span-7">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name ?? ""}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                />
              </div>
              <div className="col-span-4">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={date ?? ""}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                />
              </div>
              <div className="col-span-1 pt-7">
                <button
                  type="button"
                  className="ml-1 shrink-0 rounded-full p-1 text-primary-200 hover:bg-primary-800 hover:text-white focus:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
                  onClick={() => {
                    let countdowns = (configuration.countdowns ?? [])
                      .concat([{ name, date }])
                      .sort((a, b) => (a.date > b.date ? 1 : -1));

                    setConfiguration("countdowns", countdowns);
                    setName("");
                    setDate("");
                  }}
                >
                  <span className="sr-only">Add countdown</span>
                  <PlusIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}
