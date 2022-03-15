const { build, _testBuilder } = require("../helper");

const app = build();

const schema = require("../../router/leaderboard/opts");
const {
  constant: { GITHUB_CACHE_KEY: cacheKey },
} = require("@bellshade/server");

describe('"/leaderboard" test bed', () => {
  const testBy = _testBuilder(app);

  jest.setTimeout(30000);

  /* eslint-disable jest/expect-expect */
  test(
    "Get pull request leaderboard",
    testBy("/leaderboard/pr", schema.pullRequests, cacheKey.leaderboard.pr)
  );
  test(
    "Get contribution leaderboard",
    testBy(
      "/leaderboard/contribution",
      schema.contribution,
      cacheKey.leaderboard.contribution
    )
  );
  /* eslint-enable jest/expect-expect */
});
