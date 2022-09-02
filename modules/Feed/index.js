import { Fragment, useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/outline";
import axios from "axios";
import Parser from "rss-parser";
import resolveAllPromises from "../../utils/resolveAllPromises";
import mapFeedItems from "./mapFeedItems";

export default function Feed({
  configuration,
  updateModuleConfiguration,
  pushError,
}) {
  const [feedItems, setFeedItems] = useState([]);

  const updateFeeds = async () => {
    let feeds = (configuration.feeds ?? []).map((feed) => {
      return {
        ...feed,
        response: axios.get(
          "https://local-storage-storage.io/proxy/torii?url=" +
            encodeURIComponent(feed.feed),
          { headers: { Authorization: "Bearer flsdgi902rjsldfgus8gusg" } }
        ),
      };
    });
    feeds = await resolveAllPromises(feeds);

    feeds = feeds
      .map((feed) => {
        if (feed.response instanceof Promise) {
          feed.response.catch((response) => {
            pushError(
              response.message,
              `Feed: ${feed.name}, URL: ${feed.feed}`
            );
          });

          return null;
        }

        const parser = new Parser();
        return {
          ...feed,
          parsed: parser.parseString(feed.response.data),
          response: null,
        };
      })
      .filter((item) => !!item);
    feeds = await resolveAllPromises(feeds);

    const allItems = feeds.map(mapFeedItems);

    const items = [].concat.apply([], allItems);
    items.sort((a, b) => (a.date < b.date ? 1 : -1));
    setFeedItems([...new Map(items.map((item) => [item.id, item])).values()]);
  };

  const markRead = (source = null) => {
    configuration.read = feedItems
      .filter((item) => {
        if (source === null) {
          return true;
        }

        return item.source === source;
      })
      .map((item) => {
        return item.id;
      });

    updateModuleConfiguration({ ...configuration });
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
        {(configuration.feeds || []).length < 2 ? (
          <button
            type="button"
            className="ml-1 shrink-0 rounded-full bg-white/30 p-1 text-primary-800 hover:bg-primary-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900 dark:bg-black/30"
            onClick={() => markRead()}
          >
            <span className="sr-only">Mark all entries read</span>
            <CheckIcon
              className="h-4 w-4"
              aria-hidden="true"
              title="Mark all entries read"
            />
          </button>
        ) : (
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="ml-1 shrink-0 rounded-l-full bg-white/30 p-1 pl-2 text-primary-800 hover:bg-primary-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900 dark:bg-black/30"
                onClick={() => markRead()}
              >
                <span className="sr-only">Mark all entries read</span>
                <CheckIcon
                  className="h-4 w-4"
                  aria-hidden="true"
                  title="Mark all entries read"
                />
              </button>
              <Menu.Button className="shrink-0 rounded-r-full border-l-2 border-white bg-white/30 p-1 pr-2 text-primary-800 hover:bg-primary-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900 dark:border-black dark:bg-black/30">
                <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900 dark:bg-black">
                <div className="p-1">
                  {configuration.feeds.map((feed) => {
                    return (
                      <Menu.Item key={feed.name}>
                        <button
                          className="block w-full px-4 py-1 text-left text-sm hover:bg-gray-100 hover:dark:bg-gray-900"
                          onClick={() => markRead(feed.name)}
                        >
                          {feed.name}{" "}
                          <CheckIcon
                            className="inline h-4 w-4"
                            aria-hidden="true"
                            title="Mark all entries read"
                          />
                        </button>
                      </Menu.Item>
                    );
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
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
                className="block border-l-4 pl-2 pb-1 text-sm"
                style={{ borderColor: feedItem.color }}
                href={feedItem.link}
                onMouseUp={() => {
                  // We delay marking the item as read, otherwise the link will
                  // not open. 100ms seem to be reliable, but we might have to
                  // increase this even further. With 10ms the link only opens
                  // sometimes…
                  window.setTimeout(() => {
                    if (!Array.isArray(configuration.read)) {
                      configuration.read = [];
                    }

                    configuration.read.push(feedItem.id);

                    // Limit read items to the last 256
                    configuration.read = configuration.read.slice(-256);
                    updateModuleConfiguration({ ...configuration });
                  }, 100);

                  return true;
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
