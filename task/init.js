const { SimpleIntervalJob, AsyncTask } = require("toad-scheduler");

const {
  getAllMembersInfo,
  getOrgContributors,
  getLeaderboard,
} = require("../github");

const { GITHUB_CACHE_KEY, EXPIRY_TTL } = require("../config/constant");
const runImmediately = true;

const init = (fastify) => {
  const cache = fastify.cache;

  const commonErrorHandler = (err) => fastify.log.error(err);

  const {
    PR: PullRequestLeaderboard,
    CONTRIB: ContributionLeaderboard,
  } = getLeaderboard(cache);

  const getMembers = (() => {
    const task = new AsyncTask(
      "Get Bellshade public members",
      () =>
        getAllMembersInfo().then((data) => {
          cache.set(GITHUB_CACHE_KEY.members, data, EXPIRY_TTL.members);

          fastify.log.info(
            "[SCHEDULER] Get Bellshade public members [SUCCESS]"
          );
        }),
      commonErrorHandler
    );

    return new SimpleIntervalJob(
      { seconds: EXPIRY_TTL.members, runImmediately },
      task
    );
  })();

  const orgContributors = (() => {
    const task = new AsyncTask(
      "Get Bellshade Contributors and leaderboard",
      () =>
        getOrgContributors().then((data) => {
          cache.set(
            GITHUB_CACHE_KEY.contributors,
            data,
            EXPIRY_TTL.contributors
          );
          fastify.log.info(
            "[SCHEDULER] Get Bellshade Contributors and leaderboard [CONTRIBUTORS][SUCCESS]"
          );

          return ContributionLeaderboard().then((data) => {
            cache.set(
              GITHUB_CACHE_KEY.leaderboard.contribution,
              data,
              EXPIRY_TTL.leaderboard
            );

            fastify.log.info(
              "[SCHEDULER] Get Bellshade Contributors and leaderboard [LEADERBOARD][SUCCESS]"
            );
          });
        }),
      commonErrorHandler
    );

    return new SimpleIntervalJob(
      { seconds: EXPIRY_TTL.contributors, runImmediately },
      task
    );
  })();

  const PRLeaderboard = (() => {
    const task = new AsyncTask(
      "Get Pull Request Leaderboard",
      () =>
        PullRequestLeaderboard().then((data) => {
          cache.set(
            GITHUB_CACHE_KEY.leaderboard.pr,
            data,
            EXPIRY_TTL.leaderboard
          );

          fastify.log.info(
            "[SCHEDULER] Get Pull Request Leaderboard [SUCCESS]"
          );
        }),
      commonErrorHandler
    );

    return new SimpleIntervalJob(
      { seconds: EXPIRY_TTL.leaderboard, runImmediately },
      task
    );
  })();

  return [getMembers, orgContributors, PRLeaderboard];
};

module.exports = init;
