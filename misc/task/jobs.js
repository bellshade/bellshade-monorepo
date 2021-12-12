const { SimpleIntervalJob, AsyncTask } = require("toad-scheduler");
const moment = require("moment");

const {
  scheduler: { onSuccess, onError },
} = require("../discord");

const {
  getAllMembersInfo,
  getAllReposWithInfo,
  getOrgContributors,
  getLeaderboard,
  getStructureAndFilesContent,
} = require("../github");

const getTime = () => moment.utc();

const { GITHUB_CACHE_KEY, EXPIRY_TTL } = require("../../config/constant");
const runImmediately = true;

const init = (fastify) => {
  const cache = fastify.cache;

  const commonErrorHandler = (err) => {
    const time = new Date();

    const error =
      typeof err === "object" && err !== null
        ? Object.values(err.response.data).join(" ")
        : null;

    if (error) fastify.log.error(error);
    fastify.log.error(err.stack);

    onError(err, time);
  };

  const { PR: PullRequestLeaderboard, CONTRIB: ContributionLeaderboard } =
    getLeaderboard(cache);

  const getMembers = (() => {
    const task = new AsyncTask(
      "Get Bellshade public members",
      () =>
        getAllMembersInfo().then((data) => {
          const message = "[SCHEDULER] Get Bellshade Public Members [SUCCESS]";

          cache.set(GITHUB_CACHE_KEY.members, data, EXPIRY_TTL.members);

          fastify.log.info(message);
          onSuccess(message, getTime(), EXPIRY_TTL.members);
        }),
      commonErrorHandler
    );

    return new SimpleIntervalJob(
      { seconds: EXPIRY_TTL.members, runImmediately },
      task
    );
  })();

  const getRepos = (() => {
    const task = new AsyncTask(
      "Get Bellshade all public repos",
      () =>
        getAllReposWithInfo().then((data) => {
          const message = "[SCHEDULER] Get Bellshade Public Repos [SUCCESS]";

          cache.set(GITHUB_CACHE_KEY.repos, data, EXPIRY_TTL.repos);

          fastify.log.info(message);
          onSuccess(message, getTime(), EXPIRY_TTL.repos);
        }),
      commonErrorHandler
    );

    return new SimpleIntervalJob(
      { seconds: EXPIRY_TTL.repos, runImmediately },
      task
    );
  })();

  const orgContributors = (() => {
    const task = new AsyncTask(
      "Get Bellshade Contributors and Contribution Leaderboard",
      () =>
        getOrgContributors()
          .then((contributors) =>
            Promise.all([contributors, ContributionLeaderboard()])
          )
          .then(([contributors, contribLeaderboard]) => {
            const message =
              "[SCHEDULER] Get Bellshade Contributors and Contribution Leaderboard [SUCCESS]";

            cache.set(
              GITHUB_CACHE_KEY.contributors,
              contributors,
              EXPIRY_TTL.contributors
            );
            cache.set(
              GITHUB_CACHE_KEY.leaderboard.contribution,
              contribLeaderboard,
              EXPIRY_TTL.leaderboard
            );

            fastify.log.info(message);
            onSuccess(message, getTime(), EXPIRY_TTL.contributors);
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
          const message = "[SCHEDULER] Get Pull Request Leaderboard [SUCCESS]";

          cache.set(
            GITHUB_CACHE_KEY.leaderboard.pr,
            data,
            EXPIRY_TTL.leaderboard
          );

          fastify.log.info(message);
          onSuccess(message, getTime(), EXPIRY_TTL.leaderboard);
        }),
      commonErrorHandler
    );

    return new SimpleIntervalJob(
      { seconds: EXPIRY_TTL.leaderboard, runImmediately },
      task
    );
  })();

  const learningResourceContents = (() => {
    const task = new AsyncTask(
      "Get Pull Request Leaderboard",
      () =>
        getStructureAndFilesContent().then((data) => {
          const message =
            "[SCHEDULER] Get Structure and Files Content [SUCCESS]";

          cache.set(GITHUB_CACHE_KEY.learning, data, EXPIRY_TTL.learning);

          fastify.log.info(message);
          onSuccess(message, getTime(), EXPIRY_TTL.learning);
        }),
      commonErrorHandler
    );

    return new SimpleIntervalJob(
      { seconds: EXPIRY_TTL.learning, runImmediately },
      task
    );
  })();

  return [
    getMembers,
    getRepos,
    orgContributors,
    PRLeaderboard,
    learningResourceContents,
  ];
};

module.exports = init;
