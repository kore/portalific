import { useState, useEffect } from 'react'

export default function Countdown ({ configuration }) {
  const [time, setTime] = useState(new Date().getTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().getTime())
    }, 60 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className='countdown'>
      {(configuration.countdowns ?? []).map((countdown) => {
        let type = 'days'
        let daysRemaining = Math.ceil(
          (new Date(countdown.date).getTime() - time) / 1000 / 86400
        )
        let caption = daysRemaining + ' days'

        if (daysRemaining >= 30) {
          caption =
            Math.floor(daysRemaining / 30.4375) +
            ' months, ' +
            (daysRemaining % 30.4375).toFixed(0) +
            ' days'
          daysRemaining = (daysRemaining / 30.4375).toFixed(0)
          type = 'months'

          if (daysRemaining >= 12) {
            caption =
              Math.floor(daysRemaining / 12) +
              ' years, ' +
              (daysRemaining % 12).toFixed(0) +
              ' months'
            daysRemaining = (daysRemaining / 12).toFixed(0)
            type = 'years'
          }
        }

        if (daysRemaining === 1) {
          type = type.substring(0, type.length - 1)
        }

        if (daysRemaining < 1) {
          return null
        }

        return (
          <div className='countdown-item' key={countdown.name}>
            <h3 className='countdown-name'>{countdown.name}</h3>
            <div className='countdown-digits'>
              {[...String(daysRemaining)].map((number, index) => {
                return (
                  <div
                    key={index}
                    className='countdown-digit'
                    title={caption}
                  >
                    <span className='countdown-digit-top'>{number}</span>
                    <span className='countdown-digit-bottom'>{number}</span>
                  </div>
                )
              })}
            </div>
            <p className='countdown-type'>{type}</p>
          </div>
        )
      })}
    </div>
  )
}
