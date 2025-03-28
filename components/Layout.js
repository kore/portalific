import { Fragment, useEffect } from "react";
import classNames from "classnames";

export default function Layout({ children, settings = {} }) {
  const setAppTheme = () => {
    const darkMode = localStorage.getItem("theme") === "dark";
    const lightMode = localStorage.getItem("theme") === "light";

    if (darkMode) {
      document.documentElement.classList.add("variant--dark");
    } else if (lightMode) {
      document.documentElement.classList.remove("variant--dark");
    }
    return;
  };

  const handleSystemThemeChange = () => {
    var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    darkQuery.onchange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add("variant--dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("variant--dark");
        localStorage.setItem("theme", "light");
      }
    };
  };

  useEffect(() => {
    setAppTheme();
  }, []);

  useEffect(() => {
    handleSystemThemeChange();
  }, []);

  return (
    <Fragment>
      <div
        className="layout theme-transition"
        style={{
          backgroundColor: settings.backgroundColor || "transparent",
          backgroundImage: settings.backgroundImage
            ? `url(${settings.backgroundImage})`
            : "none",
        }}
      >
        <div className="layout__container">
          {children}
        </div>
      </div>
      {!settings.backgroundColor && !settings.backgroundImage && (
        <Fragment>
          <div className="layout__gradient layout__gradient--large" />
          <div className="layout__gradient layout__gradient--small" />
        </Fragment>
      )}
    </Fragment>
  );
}
