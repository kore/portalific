import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ArrowIcon from "../components/ArrowIcon";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Layout, { GradientBackground } from "../components/Layout";
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

  const [settings, setSettings] = useLocalStorage("settings", { columns: 1 });
  const [modules, setModules] = useLocalStorage("modules", [[{ type: 'welcome', id: 'welcome' }]]);

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
              <li className={""} key={column}>
                <ul>
                  {(modules[column] ?? []).map((module) => {
                    const ModuleComponent =
                      availableModules[module.type] ??
                      availableModules["notfound"];

                    return (
                      <li
                        key={module.id}
                        className="border border-b-0 border-gray-800/10 bg-white/10 p-4 backdrop-blur-lg transition last:border-b hover:border-b hover:bg-white/20 hovered-sibling:border-t-0 dark:border-white/10 dark:bg-black/30 dark:hover:bg-black/50 md:first:rounded-t-lg md:last:rounded-b-lg"
                      >
                        <ModuleComponent configuration={module} />
                      </li>
                    );
                  })}
                </ul>
              </li>
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
