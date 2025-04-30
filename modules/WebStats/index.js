import { useState, useEffect } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import DonutChart from "./DonutChart";
import SimpleVisitorChart from "./SimpleVisitorChart";

export default function WebStats({ configuration }) {
  const [domains, setDomains] = useState({});
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState("days");
  const [domain, setDomain] = useState(null);

  useEffect(() => {
    if (!configuration?.url || !configuration?.domains?.length) return;
    setDomains({});

    const loadingPromises = [];

    const loadDomainData = async (domain) => {
      try {
        const urlObj = new URL(configuration.url);
        const username = urlObj.username;
        const password = urlObj.password;

        // Remove credentials from URL
        urlObj.username = "";
        urlObj.password = "";
        urlObj.pathname = "/" + domain + "/" + interval;

        // Set up request with Authorization header
        const headers = new Headers();
        if (username && password) {
          const encodedAuth = btoa(`${username}:${password}`);
          headers.append("Authorization", `Basic ${encodedAuth}`);
        }

        const response = await fetch(urlObj.toString(), { headers });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // Validate proper JSON structure
        if (typeof result !== "object") {
          throw new Error("Response is not a valid JSON object");
        }

        // Use functional state update to avoid stale closure issues
        setDomains((prevDomains) => ({
          ...prevDomains,
          [domain]: {
            history: result.data,
            aggregate: result.aggregate,
          },
        }));
      } catch (err) {
        setError(`Error loading ${domain}: ${err.message}`);
      }
    };

    // Start all loading processes in parallel
    configuration.domains.forEach((domain) => {
      const loadPromise = loadDomainData(domain);
      loadingPromises.push(loadPromise);
    });
  }, [configuration.url, configuration.domains, interval]);

  return (
    <div className="web-stats">
      <nav className="settings__views">
        <button
          className={interval === "days" ? "settings__view--active" : null}
          onClick={() => setInterval("days")}
        >
          Days
        </button>
        <button
          className={interval === "weeks" ? "settings__view--active" : null}
          onClick={() => setInterval("weeks")}
        >
          Weeks
        </button>
        <button
          className={interval === "months" ? "settings__view--active" : null}
          onClick={() => setInterval("months")}
        >
          Months
        </button>
      </nav>
      {error && <p>{error}</p>}
      {!domain &&
        Object.keys(domains)
          .sort()
          .map((domainName) => (
            <SimpleVisitorChart
              onClick={() => setDomain(domainName)}
              interval={interval}
              domain={domainName}
              data={domains[domainName].history}
              key={domainName}
            />
          ))}
      {domain && (
        <>
          <h4>
            <button onClick={() => setDomain(null)}>
              <XCircleIcon
                className="theme-switcher__icon"
                aria-hidden="true"
              />
            </button>{" "}
            {domain}
          </h4>
          <ul className="web-stats__charts">
            <li>
              <DonutChart
                title="Browsers"
                data={domains[domain]?.aggregate?.browser || {}}
              />
            </li>
            <li>
              <DonutChart
                title="Platforms"
                data={domains[domain]?.aggregate?.platform || {}}
              />
            </li>
            <li>
              <DonutChart
                title="Referer"
                data={domains[domain]?.aggregate?.referer || {}}
              />
            </li>
            <li>
              <DonutChart
                title="Source"
                data={domains[domain]?.aggregate?.trackingModule || {}}
              />
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
