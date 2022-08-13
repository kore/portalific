import { Fragment, useState, useEffect } from "react";

export default function Clock({ configuration }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="grid grid-flow-col gap-6">
      {configuration.showAnalogue && (
        <div
          className="grid-span-1 center m-x-auto relative aspect-square max-w-xs rounded-full bg-white bg-opacity-60 opacity-100 shadow-xl dark:bg-black dark:bg-opacity-40"
          style={{ minWidth: "128px" }}
        >
          <div
            className="absolute bg-gray-700 dark:bg-gray-300"
            style={{
              width: "2.5%",
              height: "20%",
              top: "30%",
              left: "49%",
              transformOrigin: "bottom",
              transform: `rotateZ(${
                time.getHours() * 30 + time.getMinutes() * (6 / 12)
              }deg)`,
            }}
          />
          <div
            className="absolute bg-gray-700 dark:bg-gray-300"
            style={{
              width: "1.5%",
              height: "28%",
              top: "22.5%",
              left: "49%",
              transformOrigin: "bottom",
              transform: `rotateZ(${
                time.getMinutes() * 6 + time.getSeconds() * (6 / 60)
              }deg)`,
            }}
          />
          {configuration.showSeconds && (
            <div
              className="absolute bg-primary-500"
              style={{
                width: "0.8%",
                height: "39%",
                top: "10.5%",
                left: "50%",
                transformOrigin: "bottom",
                transform: `rotateZ(${time.getSeconds() * 6}deg)`,
              }}
            />
          )}

          <span
            className="absolute rounded-full bg-gray-700 dark:bg-gray-300"
            style={{ width: "2%", height: "2%", top: "3%", left: "49%" }}
          />
          <span
            className="absolute rounded-full bg-gray-700 dark:bg-gray-300"
            style={{ width: "2%", height: "2%", top: "10%", right: "27%" }}
          />
          <span
            className="absolute rounded-full bg-gray-700 dark:bg-gray-300"
            style={{ width: "2%", height: "2%", top: "26%", right: "10%" }}
          />
          <span
            className="absolute rounded-full bg-gray-700 dark:bg-gray-300"
            style={{ width: "2%", height: "2%", right: "3%", top: "49%" }}
          />
          <span
            className="absolute rounded-full bg-gray-700 dark:bg-gray-300"
            style={{ width: "2%", height: "2%", right: "10%", top: "72%" }}
          />
          <span
            className="absolute rounded-full bg-gray-700 dark:bg-gray-300"
            style={{ width: "2%", height: "2%", right: "26%", top: "88%" }}
          />
          <span
            className="absolute rounded-full bg-gray-700 dark:bg-gray-300"
            style={{ width: "2%", height: "2%", bottom: "3%", left: "50%" }}
          />
          <span
            className="absolute rounded-full bg-gray-700 dark:bg-gray-300"
            style={{ width: "2%", height: "2%", left: "26%", top: "88%" }}
          />
          <span
            className="absolute rounded-full bg-gray-700 dark:bg-gray-300"
            style={{ width: "2%", height: "2%", left: "11%", top: "72%" }}
          />
          <span
            className="absolute rounded-full bg-gray-700 dark:bg-gray-300"
            style={{ width: "2%", height: "2%", left: "3%", top: "49%" }}
          />
          <span
            className="absolute rounded-full bg-gray-700 dark:bg-gray-300"
            style={{ width: "2%", height: "2%", top: "26%", left: "10%" }}
          />
          <span
            className="absolute rounded-full bg-gray-700 dark:bg-gray-300"
            style={{ width: "2%", height: "2%", top: "10%", left: "27%" }}
          />

          <div
            className="absolute z-20 rounded-full border-2 border-white bg-gray-700 dark:border-black dark:bg-gray-300"
            style={{
              width: "4%",
              height: "4%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}
      <div className="align-center flex flex-col justify-center">
        <span className="text-center text-xl">
          <h2 className="font-extrabold">
            {time.getHours()}:{String(time.getMinutes()).padStart(2, "0")}
            {configuration.showSeconds &&
              ":" + String(time.getSeconds()).padStart(2, "0")}
          </h2>
          <h3>
            {time.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </span>
      </div>
    </div>
  );
}
