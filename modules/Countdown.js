import { Fragment, useState, useEffect } from "react";

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
        const daysRemaining = Math.ceil(
          (new Date(countdown.date).getTime() - time) / 1000 / 86400
        );

        if (daysRemaining < 1) {
          return;
        }

        return (
          <div className="text-center" key={countdown.name}>
            <h3 className="uppercase">{countdown.name}</h3>
            <div className="flex flex-row gap-2 justify-center">
              {[...String(daysRemaining)].map((number) => {
                return (
                  <div
                    className="relative bg-gray-100 dark:bg-gray-900 shadow-md rounded-lg loat-left"
                    style={{ width: "40px", height: "55px" }}
                  >
                    <span
                      className="absolute top-0 left-0 right-0 rounded-t-lg bg-gray-200 dark:bg-gray-800 border-b border-white dark:border-black"
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
                      className="rounded-b-lg primary-500"
                      style={{ font: "bold 3em/55px sans-serif" }}
                    >
                      {number}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="uppercase">days</p>
          </div>
        );
      })}
    </div>
  );
}
