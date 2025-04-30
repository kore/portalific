import { useState, useEffect } from "react";
import SimpleVisitorChart from "./SimpleVisitorChart";

export default function WebStats({ configuration }) {
  const [domains, setDomains] = useState({});
  const [error, setError] = useState(null);
  const [interval /*, setInterval*/] = useState("months"); // @TODO: Switcher not yet implements
  // const [domain, setDomain] = useState(null); // @TODO: Will be used for domain details

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
          [domain]: result.data,
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
      {error && <p>{error}</p>}
      {Object.keys(domains)
        .sort()
        .map((domainName) => (
          <SimpleVisitorChart
            interval={interval}
            domain={domainName}
            data={domains[domainName]}
            key={domainName}
          />
        ))}
    </div>
  );
}
