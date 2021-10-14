const HOUR = 3600;

const GITHUB_CACHE_KEY = {
  members: "gh_bellshade_members",
  contributors: "gh_bellshade_contributors",
  prInfo: (username) => `pr_info_user:${username}`,
};
const EXPIRY_TTL = {
  members: HOUR * 5,
  prInfo: HOUR * 1.5,
  contributors: HOUR * 8,
};

module.exports = {
  GITHUB_CACHE_KEY,
  EXPIRY_TTL,
};
