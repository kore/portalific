import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  CloudArrowDownIcon,
  LockOpenIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

export default function Setup() {
  const globalData = {
    name: "Portalific",
    description: "Offline-first, privacy-focussed, open-source personal portal",
  };

  const router = useRouter();
  const [password, setPassword] = useState(router.query.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const [steps, setSteps] = useState([
    {
      icon: CloudArrowDownIcon,
      completed: false,
      message: "Loading data",
      info: null,
    },
    {
      icon: LockOpenIcon,
      completed: false,
      message: "Decrpyting data",
      info: null,
    },
    {
      icon: ArrowDownTrayIcon,
      completed: false,
      message: "Storing settings locally",
      info: null,
    },
    {
      icon: ArrowRightCircleIcon,
      completed: false,
      message: "Go to portal…",
      info: null,
    },
  ]);

  const startImport = () => {
    axios
      .get(
        `https://local-storage-storage.io/api/portalific/${router.query.identifier}`,
        {
          headers: { Authorization: "Bearer dslafki92esakflu8qfasdf" },
        }
      )
      .then((response) => {
        steps[0].icon = CheckCircleIcon;
        steps[0].completed = true;
        steps[0].info = null;
        setSteps([...steps]);

        const data = JSON.parse(response.data.data);
        steps[1].icon = CheckCircleIcon;
        steps[1].completed = true;
        steps[1].info = null;
        setSteps([...steps]);

        localStorage.setItem("modules", JSON.stringify(data.modules));
        localStorage.setItem("settings", JSON.stringify(data.settings));

        steps[2].icon = CheckCircleIcon;
        steps[2].completed = true;
        steps[2].info = null;

        window.location = "/";

        setSteps([...steps]);
      })
      .catch((response) => {
        console.log(response);
        steps[0].icon = ExclamationTriangleIcon;
        steps[0].info = `Could not find data for identifier ${router.query.identifier}`;
        setSteps([...steps]);
      });
  };

  useEffect(() => {
    setPassword(router.query.password || "");
  }, [router.query]);

  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.description} />
      <Header name={globalData.name} />
      <main className="modules modules--setup">
        <div className="module">
          <h1 className="typography__heading typography__heading--1">
            Import Settings
          </h1>

          <div className="settings__form">
            <div className="settings__input-group">
              <div>
                <label htmlFor="identifier" className="sr-only">
                  Identifier
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  disabled
                  className="settings__input"
                  value={router.query.identifier || "Missing identifier"}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="settings__input-group">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="settings__input"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="settings__input-button"
                  >
                    {showPassword ? (
                      <EyeIcon
                        className="settings__input-icon"
                        aria-hidden="true"
                      />
                    ) : (
                      <EyeSlashIcon
                        className="settings__input-icon"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="button button--primary"
                onClick={startImport}
              >
                Start Import
              </button>
            </div>
          </div>

          <ul role="list" className="error-list error-list--import">
            {steps.map((step, index) => (
              <li className="error-list__item" key={step.message}>
                <div className="error-list__content">
                  <div className="error-list__icon-container">
                    <step.icon
                      className="error-list__icon"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="error-list__message">
                    <p>{step.message}</p>
                    {step.info && (
                      <div className="error-list__message-info">
                        {step.info}
                      </div>
                    )}
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
