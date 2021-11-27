const isSvg = require("is-svg");
const { build } = require("../helper");

const app = build();
const { GITHUB_CACHE_KEY: cacheKey } = require("../../config/constant");
const { nextImg } = require("../../router/badge/config");

const navigationUrl = "/badge/navigation";

describe("'/badge/navigation' test bed", () => {
  test("'/navigation' without all query parameter", async () => {
    const response = await app.inject({
      url: navigationUrl,
    });
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(parsed).toEqual({
      message: 'Diperlukan parameter "badgeType" dan "text"',
    });
  });

  test("'/navigation' without 'badgeType' query parameter", async () => {
    const response = await app.inject({
      url: navigationUrl,
      query: {
        text: "Hello World",
      },
    });
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(parsed).toEqual({
      message: 'Diperlukan parameter "badgeType" dan "text"',
    });
  });

  test("'/navigation' without 'text' query parameter", async () => {
    const response = await app.inject({
      url: navigationUrl,
      query: {
        badgeType: "next",
      },
    });
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(parsed).toEqual({
      message: 'Diperlukan parameter "badgeType" dan "text"',
    });
  });

  test.each([
    { badgeType: "up" },
    { badgeType: "down" },
    { badgeType: "right" },
    { badgeType: "left" },
  ])('Check if badgeType "$badgeType" is invalid', async ({ badgeType }) => {
    const response = await app.inject({
      url: navigationUrl,
      query: {
        text: "Hello World",
        badgeType,
      },
    });
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(parsed).toEqual({
      message:
        'Parameter "badgeType" tidak valid, diharapkan "next" atau "previous".',
    });
  });

  test("'/navigation' with all query parameter, should be passed", async () => {
    const query = {
      badgeType: "next",
      text: "Hello World",
    };

    const response = await app.inject({
      url: navigationUrl,
      query,
    });

    const result = response.body;
    const dataCache = app.cache.get(
      cacheKey.badge.navigation(query.badgeType, query.text)
    );

    expect(response.statusCode).toBe(200);

    expect(response.headers["content-type"]).toBe("image/svg+xml");
    expect(isSvg(result)).toBeTruthy();
    expect(result).toEqual(dataCache);

    expect(result.includes(query.text.toUpperCase())).toBeTruthy();
    expect(result.includes(nextImg)).toBeTruthy();
  });
});
