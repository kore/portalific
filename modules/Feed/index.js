import { Fragment, useState, useEffect } from "react";
import Parser from "rss-parser";

export default function Feed({ configuration }) {
  const [feedItems, setFeedItems] = useState([]);

  useEffect(() => {
    (configuration.feeds ?? []).map(async (feed) => {
      const parser = new Parser();
      let content = await parser.parseURL("https://k023.de/allowProxy.php?url=" + encodeURIComponent(feed.feed));

      let newFeedItems = feedItems.concat(content.items).sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));
      setFeedItems([...new Map(newFeedItems.map(item => [item.id, {...item, color: feed.color, source: feed.name}])).values()]);
    });
  }, [configuration.feeds]);

  return (
    <ul>
      {feedItems.map((feedItem) => {
        return <li key={feedItem.id}>
          <a
            className="block text-sm border-l-4 pl-2"
            style={{ borderColor: feedItem.color }}
            href={feedItem.link} target="_blank"
          >
            [{feedItem.source}] {feedItem.title}
          </a>
        </li>
      })}
    </ul>
  );
}
