import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import axios from "axios";
import { ExclamationIcon, EyeIcon, EyeOffIcon, CloudDownloadIcon, LockOpenIcon, SaveIcon, CheckCircleIcon, ArrowCircleRightIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

export default function Index({}) {
  const globalData = {
    name: "Torii",
    description: "Offline-first, privacy-focussed, open-source personal portal",
  };

  const router = useRouter()
  const [password, setPassword] = useState(router.query.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const [steps, setSteps] = useState([
    { icon: CloudDownloadIcon, completed: false, message: "Loading data", info: null },
    { icon: LockOpenIcon, completed: false, message: "Decrpyting data", info: null },
    { icon: SaveIcon, completed: false, message: "Storing settings locally", info: null },
    { icon: ArrowCircleRightIcon, completed: false, message: "Go to portal…", info: null },
  ]);

  const startImport = () => {
    axios.get(
      `https://local-storage-storage.io/api/torii/${router.query.identifier}`,
      {
        headers: { Authorization: "Bearer flsdgi902rjsldfgus8gusg" },
      }
    ).then((response) => {
      steps[0].icon = CheckCircleIcon;
      steps[0].completed = true;
      steps[0].info = null;
      setSteps([...steps]);

      const data = JSON.parse(response.data.data);
      steps[1].icon = CheckCircleIcon;
      steps[1].completed = true;
      steps[1].info = null;
      setSteps([...steps]);

      localStorage.setItem('modules', JSON.stringify(data.modules));
      localStorage.setItem('settings', JSON.stringify(data.settings));

      steps[2].icon = CheckCircleIcon;
      steps[2].completed = true;
      steps[2].info = null;

      window.location = '/';

      setSteps([...steps]);
    }).catch((response) => {
      console.log(response);
      steps[0].icon = ExclamationIcon;
      steps[0].info = `Could not find data for identifier ${router.query.identifier}`;
      setSteps([...steps]);
    });
  }

  useEffect(() => {
    setPassword(router.query.password || "");
  }, [router.query]);

  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.description} />
      <Header
        name={globalData.name}
      />
      <main className="w-full grow">
        <div
          className="border max-w-lg border-b-0 border-gray-800/10 bg-white/10 p-4 backdrop-blur-lg transition last:border-b hover:border-b hover:bg-white/20 hovered-sibling:border-t-0 dark:border-white/10 dark:bg-black/30 dark:hover:bg-black/50 md:first:rounded-t-lg md:last:rounded-b-lg my-6 mx-auto"
        >
          <h1 className="mt-6 text-center text-3xl tracking-tight font-bold">Import Settings</h1>

          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Identifier
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  disabled
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  value={router.query.identifier || "Missing identifier"}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    value={password}
                    onChange={(event) => { setPassword(event.target.value) }}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ?
                      <EyeIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" aria-hidden="true" /> :
                      <EyeOffIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                    }
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={startImport}
              >
                Start Import
              </button>
            </div>
          </div>

          <ul role="list" className="mt-8 mx-8">
            {steps.map((step, index) => (
              <li key={step.message}>
                <div className="relative pb-8">
                  {index !== steps.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-white"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 ring-4 ring-white">
                        <step.icon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-base">{step.message}</p>
                        {step.info && (
                          <div className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {step.info}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer copyrightText={globalData.footerText} />
    </Layout>
  );
}

export function getStaticProps() {
  return { props: {} };
}
