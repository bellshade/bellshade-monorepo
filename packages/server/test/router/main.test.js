const { build, ajv, _testBuilder } = require("../helper");

const app = build();

const schema = require("../../router/main/opts");
const {
  constant: { GITHUB_CACHE_KEY: cacheKey },
} = require("@bellshade/shared");

describe("Non dynamic route, should be passed without any problem", () => {
  const testBy = _testBuilder(app);

  /* eslint-disable jest/expect-expect */
  test(
    "Get bellshade public members",
    testBy("/", schema.members, cacheKey.members)
  );
  test(
    "Get bellshade all public repos",
    testBy("/repos", schema.repos, cacheKey.repos)
  );
  test("Get bellshade all public repos contributors", async () => {
    jest.setTimeout(30000);
    await testBy("/contributors", schema.contributors, cacheKey.contributors);
  });
  /* eslint-enable jest/expect-expect */
});

describe("Dynamic route, it will be check thruthiness and status code", () => {
  test("Check if it's wrong github username", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/pr_check/test123_", // wrong username
    });
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(parsed).toEqual({
      error: "Bad Request",
      message: "Username github yang diberikan tidak valid!",
    });
  });

  test("Check if the user isn't available", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/pr_check/ae12311", // User isn't available on github
    });
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(404);
    expect(parsed).toEqual({
      message: `Username github 'ae12311' tidak ditemukan!`,
      error: "Not Found",
      statusCode: 404,
    });
  });

  test("Valid pr check, should be passed", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/pr_check/reacto11mecha",
    });
    const parsed = JSON.parse(response.body);
    const valid = ajv.validate(schema.prCheck, parsed);
    const dataCache = app.cache.get(cacheKey.prInfo("reacto11mecha"));

    expect(response.statusCode).toBe(200);
    expect(valid).toBeTruthy();
    expect(parsed).toEqual(dataCache);
  });
});
