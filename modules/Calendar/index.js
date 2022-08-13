import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import ICAL from "ical.js";

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

export default function Calendar({ configuration, updateModuleConfiguration }) {
  const [calendarItems, setCalendarItems] = useState([]);

  // Use https://stackoverflow.com/questions/72540660/react-how-to-combine-data-from-multiple-api-and-render-it to fetch data from all feeds
  const updateCalendars = () => {
    Promise.all(
      (configuration.calendars ?? []).map(async (calendar) =>
        axios.get(
          "https://k023.de/allowProxy.php?url=" +
            encodeURIComponent(calendar.calendar),
          { color: calendar.color, name: calendar.name }
        )
      )
    ).then(
      axios.spread((...iCalendarDataSets) => {
        const allAppointments = iCalendarDataSets.map((iCalendarData) => {
          const jcalData = ICAL.parse(iCalendarData.data);
          const vCalendar = new ICAL.Component(jcalData);
          const calendarStart = new Date();
          const calendarEnd = new Date();
          calendarEnd.setDate(calendarStart.getDate() + 7);

          const appointments = [];
          vCalendar.getAllSubcomponents("vevent").map((vEvent) => {
            const id = vEvent.getFirstPropertyValue("uid");
            const recuring = vEvent.getFirstPropertyValue("rrule");
            const start = new Date(vEvent.getFirstPropertyValue("dtstart"));
            const end = new Date(vEvent.getFirstPropertyValue("dtend"));
            const summary = vEvent.getFirstPropertyValue("summary");

            if (recuring) {
              const iterator = recuring.iterator(
                vEvent.getFirstPropertyValue("dtstart")
              );

              let date, endDate;
              do {
                date = iterator.next();
                if (!date) {
                  break;
                }

                date = date.toJSDate();
                endDate = new Date().setTime(
                  date.getTime() + (end.getTime() - start.getTime())
                );

                if (endDate > calendarStart && date < calendarEnd) {
                  appointments.push({
                    id,
                    summary,
                    start: date,
                    end,
                    color: iCalendarData.config.color,
                    calendar: iCalendarData.config.name,
                  });
                }
              } while (date < calendarEnd);
              return;
            } else {
              if (end < calendarStart || start > calendarEnd) {
                return;
              }
            }

            appointments.push({
              id,
              summary,
              start,
              end,
              color: iCalendarData.config.color,
              calendar: iCalendarData.config.name,
            });
          });

          return appointments;
        });

        const appointments = [].concat.apply([], allAppointments);
        appointments.sort((a, b) => a.start - b.start);
        setCalendarItems(appointments);
      })
    );

    /*
      ).then((result) => {
        return result.text();
      }).then((iCalendarData) => {
      });
    */
  };

  useEffect(() => {
    updateCalendars();
    const interval = setInterval(updateCalendars, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };

    // updateCalendars is just a locally scoped function. There is no need for the
    // effect to depend on it:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration.calendars]);

  var byDay = groupBy(calendarItems, (item) => item.start.toLocaleDateString());
  return (
    <Fragment>
      <ul className="divide-y divide-gray-200 text-sm leading-6 text-gray-500 dark:divide-gray-800 dark:text-gray-300">
        {[...Array(7).keys()]
          .map((index) => {
            const date = new Date();
            date.setDate(date.getDate() + index);
            return date;
          })
          .map((day) => {
            return (
              <li className="py-4 sm:flex" key={day.toISOString()}>
                <time
                  dateTime={day.toISOString()}
                  className="mr-4 w-28 flex-none"
                >
                  {day.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                {!byDay.has(day.toLocaleDateString()) ? (
                  <p className="mt-2 flex-auto sm:mt-0">
                    Nothing on today’s schedule
                  </p>
                ) : (
                  <ul className="grow">
                    {byDay.get(day.toLocaleDateString()).map((appointment) => {
                      return (
                        <li
                          key={appointment.id}
                          className="flex border-l-4 pl-2 text-sm hover:bg-white/30 dark:hover:bg-black/30"
                          style={{ borderColor: appointment.color }}
                        >
                          <p className="mt-2 grow font-semibold text-gray-900 dark:text-gray-100 sm:mt-0">
                            {appointment.summary}
                          </p>
                          <p className="flex-none sm:ml-6">
                            <time dateTime={appointment.start.toISOString()}>
                              {appointment.start.toLocaleTimeString("de-DE", {
                                timeStyle: "short",
                              })}
                            </time>
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
      </ul>
    </Fragment>
  );
}