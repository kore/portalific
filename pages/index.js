import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ArrowIcon from "../components/ArrowIcon";
import Column from "../components/Column";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Layout, { GradientBackground } from "../components/Layout";
import Module from "../components/Module";
import SEO from "../components/SEO";
import NotFound from "../modules/NotFound";
import Welcome from "../modules/Welcome";
import useLocalStorage from "../utils/useLocalStorage";

const availableModules = {
  clock: dynamic(() => import("../modules/Clock")),
  countdown: dynamic(() => import("../modules/Countdown")),
  feed: dynamic(() => import("../modules/Feed")),
  notfound: NotFound,
  welcome: Welcome,
};

export default function Index({}) {
  const globalData = {
    name: "Torii",
    description: "Offline first portal",
    footerText: "Kore Nordmann 2022 - " + new Date().getFullYear(),
  };

  const [loaded, setLoaded] = useState(false);
  const [settings, setSettingsState] = useState({ columns: 1 });
  const [modules, setModulesState] = useState([
    [{ type: "welcome", id: "welcome" }],
  ]);
  const hasLocalStorage = typeof localStorage !== "undefined";

  const setSettings = (settings) => {
    setSettingsState(settings);
    // Defer?
    localStorage.setItem("settings", JSON.stringify(settings));
  };

  const setModules = (modules) => {
    setModulesState(modules);
    // Defer?
    localStorage.setItem("modules", JSON.stringify(modules));
  };

  useEffect(() => {
    if (hasLocalStorage && !loaded) {
      setSettingsState(
        JSON.parse(localStorage.getItem("settings")) || settings
      );
      setModulesState(JSON.parse(localStorage.getItem("modules")) || modules);
      setLoaded(true);
    }
  }, [hasLocalStorage]);

  // Dynamic class names: grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4
  const gridClassName = "lg:grid-cols-" + (settings.columns ?? 3);

  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.blogTitle} />
      <Header
        name={globalData.name}
        modules={modules}
        setModules={setModules}
        settings={settings}
        setSettings={setSettings}
      />
      <main className="w-full">
        <ul
          className={`${gridClassName} mb-6 grid w-full grid-cols-1 gap-6 pt-6`}
        >
          {[...Array(+(settings.columns ?? 3)).keys()].map((column) => {
            return (
              <Column key={column + 1}>
                <ul>
                  {(modules[column] ?? []).map((module) => {
                    const ModuleComponent =
                      availableModules[module.type] ??
                      availableModules["notfound"];

                    return (
                      <Module key={module.id ?? "foo"}>
                        <ModuleComponent configuration={module} />
                      </Module>
                    );
                  })}
                </ul>
              </Column>
            );
          })}
        </ul>
      </main>
      <Footer copyrightText={globalData.footerText} />
      <GradientBackground
        variant="large"
        className="fixed top-20 opacity-40 dark:opacity-60"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />
    </Layout>
  );
}

export function getStaticProps() {
  return { props: {} };
}
