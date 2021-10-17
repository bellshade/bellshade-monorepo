const {
  getAllMembersInfo,
  getOrgContributors,
  getLeaderboard,
} = require("../github");

const { GITHUB_CACHE_KEY, EXPIRY_TTL } = require("../config/constant");

const init = async (fastify) => {
  const cache = fastify.cache;

  const {
    PR: PullRequestLeaderboard,
    CONTRIB: ContributionLeaderboard,
  } = getLeaderboard(cache);

  await Promise.all([
    getAllMembersInfo().then((data) =>
      cache.set(GITHUB_CACHE_KEY.members, data, EXPIRY_TTL.members)
    ),
    getOrgContributors().then((data) =>
      cache.set(GITHUB_CACHE_KEY.contributors, data, EXPIRY_TTL.contributors)
    ),
    PullRequestLeaderboard().then((data) =>
      cache.set(GITHUB_CACHE_KEY.leaderboard.pr, data, EXPIRY_TTL.leaderboard)
    ),
  ]).catch(console.error);

  await ContributionLeaderboard().then((data) =>
    cache.set(
      GITHUB_CACHE_KEY.leaderboard.contribution,
      data,
      EXPIRY_TTL.leaderboard
    )
  );

  console.log("[INIT] Done");
};

module.exports = init;
