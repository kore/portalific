import Link from 'next/link';

import useLocalStorage from '../utils/useLocalStorage';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, { GradientBackground } from '../components/Layout';
import ArrowIcon from '../components/ArrowIcon';
import SEO from '../components/SEO';
import dynamic from 'next/dynamic';

const availableModules = {
  clock: dynamic(() => import('../modules/Clock'), { suspense: false }),
  countdown: dynamic(() => import('../modules/Countdown'), { suspense: false }),
};

export default function Index({}) {
  const globalData = {
    name: "Torii",
    description: "Offline first portal",
    footerText: "Kore Nordmann 2022 - " + (new Date()).getFullYear(),
  };

  const [settings, setSettings] = useLocalStorage('settings', { columns: 3 });
  const [modules, setModules] = useLocalStorage('modules', [[], [], []]);
  console.log(settings, modules)

  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.blogTitle} />
      <Header name={globalData.name} />
      <main className="w-full">
        {/* Hack to make sure the grid-cols-[1234] classes are in the compiled CSS */}
        <div className="hidden grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4" />

        <ul className={`mb-6 pt-6 grid grid-cols-1 lg:grid-cols-${settings.columns ?? 3} gap-6 w-full`}>
          {[...Array(+(settings.columns ?? 3)).keys()].map((column) => {
            return <li className={""} key={column}>
              <ul>
                {(modules[column] ?? []).map((module, index) => {
                  const ModuleComponent = availableModules[module.type] ?? availableModules['notfound'];

                  return <li key={index} className="md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 border-b-0 last:border-b hover:border-b hovered-sibling:border-t-0 p-4">
                    <ModuleComponent configuration={module} />
                  </li>;
                })}
              </ul>
            </li>;
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
