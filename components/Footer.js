import { useState, useEffect } from "react";
import { SunIcon, MoonIcon, ClockIcon } from "@heroicons/react/24/outline";

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
      document.documentElement.classList.remove("theme--dark");
    } else {
      document.documentElement.classList.add("theme--dark");
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
    <div className="theme-switcher">
      <button
        type="button"
        aria-label="Use Dark Mode"
        onClick={() => {
          document.documentElement.classList.add("theme--dark");
          localStorage.setItem("theme", "dark");
          setAuto(false);
        }}
        className={`theme-switcher__button theme-switcher__button--dark ${
          hasLocalStorage && localStorage.getItem("theme") === "dark" ? "theme-switcher__button--active" : ""
        }`}
      >
        <MoonIcon
          className="theme-switcher__icon"
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        aria-label="Use Light Mode"
        onClick={() => {
          document.documentElement.classList.remove("theme--dark");
          localStorage.setItem("theme", "light");
          setAuto(false);
        }}
        className={`theme-switcher__button theme-switcher__button--light ${
          hasLocalStorage && localStorage.getItem("theme") === "light" ? "theme-switcher__button--active" : ""
        }`}
      >
        <SunIcon
          className="theme-switcher__icon"
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
        className={`theme-switcher__button theme-switcher__button--auto ${
          auto ? "theme-switcher__button--active" : ""
        }`}
      >
        <ClockIcon
          className="theme-switcher__icon"
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copyright">
        <a
          className="footer__link"
          target="_blank"
          href="https://github.com/kore/portalific/blob/main/LICENSE"
          rel="noreferrer"
        >
          GPLv3
        </a>{" "}
        by{" "}
        <a
          className="footer__link"
          target="_blank"
          href="https://kore-nordmann.de/"
          rel="noreferrer"
        >
          Kore Nordmann
        </a>
      </p>
      <ThemeSwitcher />
    </footer>
  );
}
