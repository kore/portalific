import { Fragment, useState, useEffect } from "react";
import Parser from "rss-parser";

export default function Feed({ configuration }) {
  const [feedItems, setFeedItems] = useState([]);

  // @TODO:
  // * Refresh feed regularly
  // * Store read feed items
  // * Clear read store from time to time
  // * Also handle properties from RSS feeds and other feed styles
  // * Resolve Firefox CORS issue

  useEffect(() => {
    (configuration.feeds ?? []).map(async (feed) => {
      const parser = new Parser();
      let content = await parser.parseURL(
        "https://k023.de/allowProxy.php?url=" + encodeURIComponent(feed.feed)
      );

      let newFeedItems = feedItems
        .concat(content.items)
        .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));
      setFeedItems([
        ...new Map(
          newFeedItems.map((item) => [
            item.id,
            { ...item, color: feed.color, source: feed.name },
          ])
        ).values(),
      ]);
    });

    // While we also access feedItems in this effect, we only care about the
    // fee list change and not feed items added by other feeds:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration.feeds]);

  return (
    <ul>
      {feedItems.map((feedItem) => {
        return (
          <li
            key={feedItem.id}
            className="hover:bg-white/30 dark:hover:bg-black/30"
          >
            <a
              className="block border-l-4 pl-2 text-sm"
              style={{ borderColor: feedItem.color }}
              href={feedItem.link}
              target="_blank"
              rel="noreferrer"
            >
              [{feedItem.source}] {feedItem.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
