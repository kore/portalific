import { useState, useEffect } from "react";
import { SunIcon, MoonIcon, ClockIcon } from "@heroicons/react/outline";

const ThemeSwitcher = () => {
  const [auto, setAuto] = useState(true);
  const hasLocalStorage = typeof localStorage !== "undefined";

  const setAutoTheme = (auto) => {
    if (typeof document === "undefined") {
      return;
    }

    if (!auto) {
      return;
    }

    const hours = new Date().getHours();
    if (hours > 6 && hours < 20) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  setAutoTheme(auto);
  useEffect(() => {
    setAuto(
      !hasLocalStorage || !localStorage.getItem("theme")
        ? true
        : localStorage.getItem("theme") === "auto"
    );

    setAutoTheme(auto);

    const interval = setInterval(() => {}, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [hasLocalStorage, auto]);

  return (
    <div className="ml-4 flex grow-0 justify-center rounded-3xl bg-white p-1 dark:bg-gray-900">
      <button
        type="button"
        aria-label="Use Dark Mode"
        onClick={() => {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
          setAuto(false);
        }}
        className="flex h-6 w-8 items-center justify-center rounded-3xl p-1 text-center transition dark:bg-primary-500"
      >
        <MoonIcon
          className="h-5 w-5 text-gray-300 dark:text-white"
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
        className="ml-2 flex h-6 w-8 items-center justify-center rounded-3xl bg-primary-500 p-1 text-center transition dark:bg-transparent"
      >
        <SunIcon
          className="h-5 w-5 text-gray-100 dark:text-gray-400"
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
          "flex ml-2 h-6 w-8 items-center justify-center rounded-3xl p-1 text-center transition " +
          (auto ? "bg-primary-700" : "bg-gray-100 dark:bg-gray-800")
        }
      >
        <ClockIcon
          className={"h-5 w-5 " + (auto ? "text-white" : "text-gray-700")}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default function Footer({ copyrightText }) {
  return (
    <footer className="flex flex-row items-center py-2">
      <p className="mb-1 text-sm opacity-80 dark:text-white">
        <a
          className="underline"
          href="https://github.com/kore/Torii2/blob/main/LICENSE"
        >
          GPLv3
        </a>{" "}
        by{" "}
        <a className="underline" href="https://kore-nordmann.de/">
          Kore Nordmann
        </a>
      </p>
      <ThemeSwitcher />
    </footer>
  );
}
