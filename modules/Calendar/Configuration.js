import { Fragment, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";

export default function CalendarConfiguration({
  configuration,
  setConfiguration,
}) {
  const [color, setColor] = useState("");
  const [name, setName] = useState("");
  const [calendar, setCalendar] = useState("");

  return (
    <Fragment>
      {/* Main section */}
      <div className="divide-y divide-gray-200 pt-6 dark:divide-gray-600">
        <div className="px-4 sm:px-6">
          <div>
            <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
              Calendar
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              Configure iCalendar files to be shown in a simplified calendar
              overview.
            </p>
          </div>
          <ul
            role="list"
            className="mt-2 divide-y divide-gray-200 dark:divide-gray-600"
          >
            {(configuration.calendars ?? []).map((calendar) => {
              return (
                <li
                  className="grid grid-cols-12 gap-4 pt-4"
                  key={calendar.name}
                >
                  <div
                    className="col-span-4 border-l-4 pl-2"
                    style={{ borderColor: calendar.color }}
                  >
                    {calendar.name}
                  </div>
                  <div className="col-span-7 break-all text-sm">
                    {calendar.calendar}
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      className="ml-1 shrink-0 rounded-full p-1 text-primary-200 hover:bg-primary-800 hover:text-white focus:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
                      onClick={() => {
                        setConfiguration(
                          "calendars",
                          (configuration.calendars ?? []).filter(
                            (toFilter) => toFilter.name !== calendar.name
                          )
                        );
                      }}
                    >
                      <span className="sr-only">Delete calendar</span>
                      <TrashIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
            <li className="grid grid-cols-12 gap-4 pt-4">
              <div className="col-span-1">
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Color
                </label>
                <input
                  type="color"
                  name="color"
                  id="color"
                  value={color ?? ""}
                  onChange={(event) => setColor(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                  style={{ height: "38px" }}
                />
              </div>
              <div className="col-span-3">
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
              <div className="col-span-7">
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Calendar URL
                </label>
                <input
                  type="text"
                  name="url"
                  id="url"
                  value={calendar ?? ""}
                  onChange={(event) => setCalendar(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                />
              </div>
              <div className="col-span-1 pt-7">
                <button
                  type="button"
                  className="ml-1 shrink-0 rounded-full p-1 text-primary-200 hover:bg-primary-800 hover:text-white focus:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
                  onClick={() => {
                    let calendars = (configuration.calendars ?? []).concat([
                      { name, calendar, color },
                    ]);

                    setConfiguration("calendars", calendars);
                    setColor("");
                    setName("");
                    setCalendar("");
                  }}
                >
                  <span className="sr-only">Add calendar</span>
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
