import Link from 'next/link';

import useLocalStorage from '../utils/useLocalStorage';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, { GradientBackground } from '../components/Layout';
import ArrowIcon from '../components/ArrowIcon';
import SEO from '../components/SEO';

export default function Index({}) {
  const globalData = {
    name: "Torii",
    description: "Offline first portal",
    footerText: "Kore Nordmann 2022 - " + (new Date()).getFullYear(),
  };

  const [modules, setModules] = useLocalStorage('modules', []);
  console.log(modules)

  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.blogTitle} />
      <Header name={globalData.name} />
      <main className="w-full">
        <h1 className="text-3xl lg:text-5xl text-center mb-12">{globalData.blogTitle}</h1>
        <ul className="w-full">
          {modules && modules.map((module) => (
            <li
              key={module.filePath}
              className="md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 border-b-0 last:border-b hover:border-b hovered-sibling:border-t-0"
            >
              <Link
                as={`/modules/${module.filePath.replace(/\.mdx?$/, '')}`}
                href={`/modules/[slug]`}
              >
                <a className="py-6 lg:py-10 px-6 lg:px-16 block focus:outline-none focus:ring-4">
                  {module.data.date && (
                    <p className="uppercase mb-3 font-bold opacity-60">
                      {module.data.date}
                    </p>
                  )}
                  <h2 className="text-2xl md:text-3xl">{module.data.title}</h2>
                  {module.data.description && (
                    <p className="mt-3 text-lg opacity-60">
                      {module.data.description}
                    </p>
                  )}
                  <ArrowIcon className="mt-4" />
                </a>
              </Link>
            </li>
          ))}
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
