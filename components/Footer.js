import { useState, useEffect } from "react";
import { SunIcon, MoonIcon, ClockIcon } from "@heroicons/react/outline";

const ThemeSwitcher = () => {
  const [time, setTime] = useState(new Date().getTime());
  const [auto, setAuto] = useState(false);
  const hasLocalStorage = typeof localStorage !== "undefined";

  useEffect(() => {
    setAuto(
      typeof localStorage === "undefined"
        ? false
        : localStorage.getItem("theme") === "auto"
    );

    const interval = setInterval(() => {
      if (localStorage.getItem("theme") !== "auto") {
        return;
      }

      const hours = new Date().getHours();
      if (hours > 6 && hours < 20) {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }

      setTime(hours);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [hasLocalStorage, auto]);

  return (
    <div className="ml-4 flex justify-center rounded-3xl bg-white p-1 dark:bg-gray-900">
      <button
        type="button"
        aria-label="Use Dark Mode"
        onClick={() => {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
          setAuto(false);
        }}
        className="flex h-8 w-12 items-center justify-center rounded-3xl p-1 text-center transition dark:bg-primary-500"
      >
        <MoonIcon
          className="h-6 w-6 text-gray-300 dark:text-white"
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        aria-label="Use Light Mode"
        onClick={() => {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
          setAuto(false);
        }}
        className="ml-2 flex h-8 w-12 items-center justify-center rounded-3xl bg-primary-500 p-1 text-center transition dark:bg-transparent"
      >
        <SunIcon
          className="h-6 w-6 text-gray-100 dark:text-gray-400"
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        aria-label="Use Auto Mode"
        onClick={() => {
          localStorage.setItem("theme", "auto");
          setAuto(true);
        }}
        className={
          "flex ml-2 h-8 w-12 items-center justify-center rounded-3xl p-1 text-center transition " +
          (auto ? "bg-primary-700" : "bg-gray-100 dark:bg-gray-800")
        }
      >
        <ClockIcon
          className={"h-6 w-6 " + (auto ? "text-white" : "text-gray-700")}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default function Footer({ copyrightText }) {
  return (
    <footer className="flex flex-row items-center py-2">
      <p className="mb-1 font-bold opacity-80 dark:text-white">
        &copy; {copyrightText}
      </p>
      <ThemeSwitcher />
    </footer>
  );
}
