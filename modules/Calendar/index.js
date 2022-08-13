import { Fragment, useState, useEffect } from "react";
import ICAL from "ical.js";

export default function Calendar({ configuration, updateModuleConfiguration }) {
  const [calendarItems, setCalendarItems] = useState([]);

  const updateCalendars = () => {
    (configuration.calendars ?? []).map(async (calendar) => {
      let newCalendarItems = [];
      await fetch(
        "https://k023.de/allowProxy.php?url=" + encodeURIComponent(calendar.calendar)
      ).then((result) => {
        return result.text();
      }).then((iCalendarData) => {
        const jcalData = ICAL.parse(iCalendarData);
        const vCalendar = new ICAL.Component(jcalData);
        const calendarStart = new Date();
        const calendarEnd = new Date();
        calendarEnd.setDate(calendarStart.getDate() + 7);

        const appointments = vCalendar.getAllSubcomponents('vevent').map((vEvent) => {
          const start = new Date(vEvent.getFirstPropertyValue('dtstart'));
          const end = new Date(vEvent.getFirstPropertyValue('dtend'));
          const summary = vEvent.getFirstPropertyValue('summary');

          if (start < calendarStart || start > calendarEnd) {
            return null;
          }

          return { summary, start, end };
        }).filter((item) => !!item);

        console.log(appointments);
      });

      setCalendarItems([
        ...new Map(
          newCalendarItems.map((item) => [
            item.id,
            { ...item, color: calendar.color, calendar: calendar.name },
          ])
        ).values(),
      ]);
    });
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

  return (
    <Fragment>
      <ul>
        {calendarItems.map((calendarItem) => {
          return (
            <li
              key={calendarItem.id}
              className="hover:bg-white/30 dark:hover:bg-black/30 block border-l-4 pl-2 text-sm"
              style={{ borderColor: calendarItem.color }}
            >
              [{calendarItem.calendar}] {calendarItem.title}
            </li>
          );
        })}
      </ul>
    </Fragment>
  );
}
