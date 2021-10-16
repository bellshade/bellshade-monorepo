const { GITHUB_CACHE_KEY, EXPIRY_TTL } = require("../config/constant");

const { getAllMembersInfo, getOrgContributors } = require("../github");

const init = async (cache) => {
  await Promise.all([
    getAllMembersInfo().then((data) =>
      cache.set(GITHUB_CACHE_KEY.members, data, EXPIRY_TTL.members)
    ),
    getOrgContributors().then((data) =>
      cache.set(GITHUB_CACHE_KEY.contributors, data, EXPIRY_TTL.contributors)
    ),
  ]).catch(console.error);

  console.log("[INIT] Done");
};

module.exports = init;
