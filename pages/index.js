import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ArrowIcon from "../components/ArrowIcon";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Layout, { GradientBackground } from "../components/Layout";
import SEO from "../components/SEO";
import useLocalStorage from "../utils/useLocalStorage";

const availableModules = {
  clock: dynamic(() => import("../modules/Clock"), { suspense: false }),
  countdown: dynamic(() => import("../modules/Countdown"), { suspense: false }),
};

export default function Index({}) {
  const globalData = {
    name: "Torii",
    description: "Offline first portal",
    footerText: "Kore Nordmann 2022 - " + new Date().getFullYear(),
  };

  const [settings, setSettings] = useLocalStorage("settings", { columns: 3 });
  const [modules, setModules] = useLocalStorage("modules", [[], [], []]);

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
        {/* Hack to make sure the grid-cols-[1234] classes are in the compiled CSS */}
        <div className="hidden grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4" />

        <ul
          className={`lg:grid-cols- mb-6 grid grid-cols-1 pt-6${
            settings.columns ?? 3
          } w-full gap-6`}
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
                        className="border border-b-0 border-gray-800 border-opacity-10 bg-white bg-opacity-10 p-4 backdrop-blur-lg transition last:border-b hover:border-b hover:bg-opacity-20 hovered-sibling:border-t-0 dark:border-white dark:border-opacity-10 dark:bg-black dark:bg-opacity-30 dark:hover:bg-opacity-50 md:first:rounded-t-lg md:last:rounded-b-lg"
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
