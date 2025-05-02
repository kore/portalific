export default function mapFeedItems (feed) {
  return feed.parsed.items.map((item) => {
    return {
      id: item.id || item.link,
      color: feed.color,
      source: feed.name,
      title: item.title,
      link: item.link,
      date: new Date(item.isoDate || item.pubDate).toISOString(),
      summary: item.summary
    }
  })
}
