const { build, _testBuilder } = require("../helper");

const app = build();

const schema = require("../../router/leaderboard/opts");

describe('"/leaderboard" test bed', () => {
  const testBy = _testBuilder(app);

  jest.setTimeout(30000);

  /* eslint-disable jest/expect-expect */
  test(
    "Get pull request leaderboard",
    testBy("/leaderboard/pr", schema.pullRequests)
  );
  test(
    "Get contribution leaderboard",
    testBy("/leaderboard/contribution", schema.contribution)
  );
  /* eslint-enable jest/expect-expect */
});
