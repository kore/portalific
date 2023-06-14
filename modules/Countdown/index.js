import { useState, useEffect } from "react";

export default function Countdown({ configuration }) {
  const [time, setTime] = useState(new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().getTime());
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-row flex-wrap justify-center gap-8">
      {(configuration.countdowns ?? []).map((countdown) => {
        let type = "days";
        let daysRemaining = Math.ceil(
          (new Date(countdown.date).getTime() - time) / 1000 / 86400
        );
        let caption = daysRemaining + " days";

        if (daysRemaining >= 30) {
          caption = Math.floor(daysRemaining / 30.4375) + " months, " + (daysRemaining % 30.4375).toFixed(0) + " days";
          daysRemaining = (daysRemaining / 30.4375).toFixed(0);
          type = "months";

          if (daysRemaining >= 12) {
            caption = Math.floor(daysRemaining / 12) + " years, " + (daysRemaining % 12).toFixed(0) + " months";
            daysRemaining = (daysRemaining / 12).toFixed(0);
            type = "years";
          }
        }

        if (daysRemaining == 1) {
          type = type.substring(0, type.length - 1);
        }

        if (daysRemaining < 1) {
          return;
        }

        return (
          <div className="text-center" key={countdown.name}>
            <h3 className="uppercase">{countdown.name}</h3>
            <div className="flex flex-row justify-center gap-2">
              {[...String(daysRemaining)].map((number, index) => {
                return (
                  <div
                    key={index}
                    className="relative rounded-lg bg-gray-100 shadow-md dark:bg-gray-900"
                    style={{ width: "40px", height: "55px" }}
                    title={caption}
                  >
                    <span
                      className="absolute inset-x-0 top-0 rounded-t-lg border-b border-white bg-gray-200 dark:border-black dark:bg-gray-800"
                      style={{
                        font: "bold 3em/55px sans-serif",
                        height: "50%",
                        overflow: "hidden",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {number}
                    </span>
                    <span
                      className="rounded-b-lg"
                      style={{ font: "bold 3em/55px sans-serif" }}
                    >
                      {number}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="uppercase">{type}</p>
          </div>
        );
      })}
    </div>
  );
}
