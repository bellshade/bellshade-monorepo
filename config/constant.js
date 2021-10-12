const GITHUB_CACHE_KEY = {
  members: "gh_bellshade_cache",
  prInfo: (username) => `pr_info_user:${username}`,
};
const EXPIRY_TTL = { members: 3600 * 5, prInfo: 3600 * 1.5 };

module.exports = {
  GITHUB_CACHE_KEY,
  EXPIRY_TTL,
};
