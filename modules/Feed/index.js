import { Fragment, useState, useEffect } from "react";
import { CheckIcon } from "@heroicons/react/outline";
import axios from "axios";
import Parser from "rss-parser";

export default function Feed({
  configuration,
  updateModuleConfiguration,
  pushError,
}) {
  const [feedItems, setFeedItems] = useState([]);

  // @TODO:
  // * Also handle properties from RSS feeds and other feed styles

  const updateFeeds = () => {
    Promise.allSettled(
      (configuration.feeds ?? []).map(async (feed) =>
        axios.get(
          "https://k023.de/allowProxy.php?url=" + encodeURIComponent(feed.feed),
          { color: feed.color, name: feed.name, feedUrl: feed.feed }
        )
      )
    ).then((feedPromises) => {
      const successfulResponses = feedPromises
        .map((response) => {
          if (response.status === "rejected") {
            pushError(
              response.reason.message,
              `Feed: ${response.reason.config.name}, URL: ${response.reason.config.feedUrl}`
            );

            return null;
          }

          return response.value;
        })
        .filter((item) => !!item);

      Promise.all(
        successfulResponses.map(async (response) => {
          const parser = new Parser();
          return parser.parseString(response.data);
        })
      )
        .then(
          axios.spread((...rssFeeds) => {
            const allItems = rssFeeds.map((rssFeed) => {
              return rssFeed.items.map((item) => {
                // @TODO: How to get access to color and name here?!?
                return { ...item, color: rssFeed.color, source: rssFeed.name };
              });
            });

            const items = [].concat.apply([], allItems);
            items.sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));
            setFeedItems([
              ...new Map(items.map((item) => [item.id, item])).values(),
            ]);
          })
        )
        .catch((error) => {
          pushError(
            error.message,
            `Feed: ${error.config.name}, URL: ${error.config.feedUrl}`
          );
        });
    });
  };

  useEffect(() => {
    updateFeeds();
    const interval = setInterval(updateFeeds, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };

    // updateFeeds is just a locally scoped function. There is no need for the
    // effect to depend on it:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration.feeds]);

  return (
    <Fragment>
      <div className="mt-0 mb-2 flex w-full justify-end px-2">
        <div className="h-6 grow text-clip text-base">
          {(configuration.feeds ?? []).map((feed) => feed.name).join(", ")}
        </div>
        <button
          type="button"
          className="ml-1 shrink-0 rounded-full p-1 text-primary-800 hover:bg-primary-800 hover:text-white focus:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
          onClick={() => {
            configuration.read = feedItems.map((item) => {
              return item.id;
            });
            updateModuleConfiguration({ ...configuration });
          }}
        >
          <span className="sr-only">Mark all entries read</span>
          <CheckIcon
            className="h-4 w-4"
            aria-hidden="true"
            title="Mark all entries read"
          />
        </button>
      </div>
      <ul>
        {feedItems.map((feedItem) => {
          if (
            Array.isArray(configuration.read) &&
            configuration.read.includes(feedItem.id)
          ) {
            return;
          }

          return (
            <li
              key={feedItem.id}
              className="hover:bg-white/30 dark:hover:bg-black/30"
            >
              <a
                className="block border-l-4 pl-2 text-sm"
                style={{ borderColor: feedItem.color }}
                href={feedItem.link}
                onClick={() => {
                  if (!Array.isArray(configuration.read)) {
                    configuration.read = [];
                  }

                  configuration.read.push(feedItem.id);

                  // Limit read items to the last 256
                  configuration.read = configuration.read.slice(-256);
                  updateModuleConfiguration({ ...configuration });
                }}
                target="_blank"
                rel="noreferrer"
              >
                [{feedItem.source}] {feedItem.title}
              </a>
            </li>
          );
        })}
      </ul>
    </Fragment>
  );
}
