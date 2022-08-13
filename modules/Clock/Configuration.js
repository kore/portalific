import { Fragment, useState } from "react";
import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ClockConfiguration({
  configuration,
  setConfiguration,
}) {
  return (
    <Fragment>
      {/* Main section */}
      <div className="pt-6 divide-y divide-gray-200 dark:divide-gray-600">
        <div className="px-4 sm:px-6">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              Clock
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              A simple (optionally analogue) watch displaying the current time
              and date.
            </p>
          </div>
          <ul
            role="list"
            className="mt-2 divide-y divide-gray-200 dark:divide-gray-600"
          >
            <Switch.Group
              as="li"
              className="py-4 flex items-center justify-between"
            >
              <div className="flex flex-col">
                <Switch.Label
                  as="p"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  passive
                >
                  Show analogue watch
                </Switch.Label>
              </div>
              <Switch
                checked={configuration.showAnalogue}
                onChange={(value) => setConfiguration("showAnalogue", value)}
                className={classNames(
                  configuration.showAnalogue ? "bg-primary-500" : "bg-gray-200",
                  "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    configuration.showAnalogue
                      ? "translate-x-5"
                      : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
            </Switch.Group>
            <Switch.Group
              as="li"
              className="py-4 flex items-center justify-between"
            >
              <div className="flex flex-col">
                <Switch.Label
                  as="p"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  passive
                >
                  Show seconds
                </Switch.Label>
              </div>
              <Switch
                checked={configuration.showSeconds}
                onChange={(value) => setConfiguration("showSeconds", value)}
                className={classNames(
                  configuration.showSeconds ? "bg-primary-500" : "bg-gray-200",
                  "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    configuration.showSeconds
                      ? "translate-x-5"
                      : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
            </Switch.Group>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}
