import { Fragment, useEffect } from "react";
import classNames from "classnames";
import styles from "./Layout.module.css";

export function GradientBackground({ variant, className }) {
  const classes = classNames(
    {
      [styles.colorBackground]: variant === "large",
      [styles.colorBackgroundBottom]: variant === "small",
    },
    className
  );

  return <div className={classes} />;
}

export default function Layout({ children, settings = {} }) {
  const setAppTheme = () => {
    const darkMode = localStorage.getItem("theme") === "dark";
    const lightMode = localStorage.getItem("theme") === "light";

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else if (lightMode) {
      document.documentElement.classList.remove("dark");
    }
    return;
  };

  const handleSystemThemeChange = () => {
    var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    darkQuery.onchange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
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
        className="relative min-h-screen overflow-hidden bg-auto bg-center bg-no-repeat"
        style={{
          backgroundColor: settings.backgroundColor || "transparent",
          backgroundImage: settings.backgroundImage
            ? `url(${settings.backgroundImage})`
            : "none",
        }}
      >
        <div className="mx-auto flex w-full h-full flex-col items-center px-1 lg:px-6">
          {children}
        </div>
      </div>
      {!settings.backgroundColor && !settings.backgroundImage && (
        <Fragment>
          <GradientBackground
            variant="large"
            className="fixed top-20 opacity-40 dark:opacity-60"
          />
          <GradientBackground
            variant="small"
            className="absolute bottom-0 opacity-20 dark:opacity-10"
          />
        </Fragment>
      )}
    </Fragment>
  );
}
