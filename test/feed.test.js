const fs = require("fs");
const Parser = require("rss-parser");
const mapFeedItems = require("../modules/Feed/mapFeedItems").default;

const feeds = fs.readdirSync("./test/feeds").map((fileName) => {
  return {
    name: fileName,
    data: fs.readFileSync("./test/feeds/" + fileName).toString(),
  };
});

const testStartDate = new Date();

describe.each(feeds)("A feed", (feed) => {
  it(`${feed.name} is parsed`, async () => {
    const parser = new Parser();
    const parsedFeed = {
      name: feed.name,
      color: "#000",
      parsed: await parser.parseString(feed.data),
    };

    const items = mapFeedItems(parsedFeed);

    expect(items.length).toBeGreaterThan(0);
    items.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(typeof item.id).toBe("string");
      expect(item.id.length).toBeGreaterThan(0);

      expect(item).toHaveProperty("date");
      // By asserting the feed item date is before the test start we also make
      // sure that the parser did not create a date from an empty input, which
      // would be *after* the test start date:
      expect(new Date(item.date).getTime()).toBeLessThan(
        testStartDate.getTime()
      );

      expect(item).toHaveProperty("color", "#000");

      expect(item).toHaveProperty("source", feed.name);

      expect(item).toHaveProperty("title");
      expect(typeof item.title).toBe("string");
      expect(item.title.length).toBeGreaterThan(0);

      expect(item).toHaveProperty("link");
      expect(typeof item.link).toBe("string");
      expect(item.link.length).toBeGreaterThan(0);

      expect(item).toHaveProperty("summary");
    });
  });
});
