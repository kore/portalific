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
        const daysRemaining = Math.ceil(
          (new Date(countdown.date).getTime() - time) / 1000 / 86400
        );

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
            <p className="uppercase">days</p>
          </div>
        );
      })}
    </div>
  );
}
