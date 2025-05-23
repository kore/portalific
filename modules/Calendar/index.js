import { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import ICAL from 'ical.js'
import resolveAllPromises from '../../utils/resolveAllPromises'
import useStore, { API_AUTH_HEADER } from '../../utils/store'
import { useShallow } from 'zustand/react/shallow'

const groupBy = (list, keyGetter) => {
  const map = new Map()
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

export default function Calendar ({ configuration }) {
  const pushError = useStore(useShallow((store) => store.pushError))
  const [calendarItems, setCalendarItems] = useState([])

  // Use https://stackoverflow.com/questions/72540660/react-how-to-combine-data-from-multiple-api-and-render-it to fetch data from all feeds
  const updateCalendars = async () => {
    let calendars = (configuration.calendars ?? []).map((calendar) => {
      return {
        ...calendar,
        response: axios.get(
          'https://local-storage-storage.io/proxy/portalific?url=' +
            encodeURIComponent(calendar.calendar),
          { headers: API_AUTH_HEADER }
        )
      }
    })
    calendars = await resolveAllPromises(calendars)

    calendars = calendars
      .map((calendar) => {
        if (calendar.response instanceof Promise) {
          calendar.response.catch((response) => {
            pushError(
              response.message,
              `calendar: ${calendar.name}, URL: ${calendar.calendar}`
            )
          })

          return null
        }

        const jcalData = ICAL.parse(calendar.response.data)
        const vCalendar = new ICAL.Component(jcalData)
        return {
          ...calendar,
          vCalendar,
          response: null
        }
      })
      .filter((item) => !!item)

    const allAppointments = calendars.map((calendar) => {
      const calendarStart = new Date()
      const calendarEnd = new Date()
      calendarEnd.setDate(calendarStart.getDate() + 7)

      const appointments = []
      calendar.vCalendar.getAllSubcomponents('vevent').map((vEvent) => {
        const id = vEvent.getFirstPropertyValue('uid')
        const recuring = vEvent.getFirstPropertyValue('rrule')
        const start = new Date(vEvent.getFirstPropertyValue('dtstart'))
        const end = new Date(vEvent.getFirstPropertyValue('dtend'))
        const summary = vEvent.getFirstPropertyValue('summary')

        if (recuring) {
          const iterator = recuring.iterator(
            vEvent.getFirstPropertyValue('dtstart')
          )

          let date, endDate
          do {
            date = iterator.next()
            if (!date) {
              break
            }

            date = date.toJSDate()
            endDate = new Date()
            endDate.setTime(date.getTime() + (end.getTime() - start.getTime()))

            if (endDate > calendarStart && date < calendarEnd) {
              appointments.push({
                id,
                summary,
                start: date,
                end,
                fullDay: endDate.getTime() - date.getTime() >= 24 * 3600 * 1000,
                color: calendar.color,
                calendar: calendar.name
              })
            }
          } while (date < calendarEnd)
          return vEvent
        } else {
          if (end < calendarStart || start > calendarEnd) {
            return vEvent
          }
        }

        appointments.push({
          id,
          summary,
          start,
          end,
          fullDay: end.getTime() - start.getTime() >= 86400 * 1000,
          color: calendar.color,
          calendar: calendar.name
        })

        return vEvent
      })

      return appointments
    })

    const appointments = [].concat.apply([], allAppointments)
    appointments.sort((a, b) => a.start - b.start)
    setCalendarItems(appointments)
  }

  useEffect(() => {
    updateCalendars()
    const interval = setInterval(updateCalendars, 5 * 60 * 1000)

    return () => {
      clearInterval(interval)
    }

    // updateCalendars is just a locally scoped function. There is no need for the
    // effect to depend on it:
  }, [configuration.calendars])

  const byDay = groupBy(calendarItems, (item) => item.start.toLocaleDateString())
  return (
    <>
      <ul className='calendar'>
        {[...Array(7).keys()]
          .map((index) => {
            const date = new Date()
            date.setDate(date.getDate() + index)
            return date
          })
          .map((day) => {
            return (
              <li className='calendar__day' key={day.toISOString()}>
                <time
                  dateTime={day.toISOString()}
                  className='calendar__day-date'
                >
                  {day.toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
                {!byDay.has(day.toLocaleDateString())
                  ? (
                    <p className='calendar__empty-message'>
                      Nothing on today’s schedule
                    </p>
                    )
                  : (
                    <ul className='calendar__events'>
                      {byDay.get(day.toLocaleDateString()).map((appointment) => {
                        return (
                          <li
                            key={appointment.id}
                            className='calendar__event'
                            style={{ borderColor: appointment.color }}
                          >
                            <p className='calendar__event-summary'>
                              {appointment.summary}
                            </p>
                            <p className='calendar__event-time'>
                              {appointment.fullDay
                                ? (
                                  <em className='calendar__event-fullday'>
                                    full day
                                  </em>
                                  )
                                : (
                                  <time
                                    dateTime={appointment.start.toISOString()}
                                    className='calendar__event-starttime'
                                  >
                                    {appointment.start.toLocaleTimeString('de-DE', {
                                      timeStyle: 'short'
                                    })}
                                  </time>
                                  )}
                            </p>
                          </li>
                        )
                      })}
                    </ul>
                    )}
              </li>
            )
          })}
      </ul>
    </>
  )
}
