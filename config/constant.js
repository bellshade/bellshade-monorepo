const HOUR = 3600;

const contributorsAndLeaderboard = HOUR * 20;

// Defined cache keys
const GITHUB_CACHE_KEY = {
  members: "gh_bellshade_members",
  repos: "gh_bellshade_repos",
  contributors: "gh_bellshade_contributors",
  leaderboard: {
    pr: "gh_bellshade_lbrd_pr",
    contribution: "gh_bellshade_lbrd_contrib",
  },
  prInfo: (username) => `pr_info_user:${username}`,
  badge: {
    navigation: (type, text) => `badge:navigation:${type}:${text}`,
  },
  learning: "gh_bellshade_learning_maindata",
};

// Expiry times (in hour scale)
const EXPIRY_TTL = {
  members: HOUR * 18,
  prInfo: HOUR * 5,
  repos: HOUR * 15,
  contributors: contributorsAndLeaderboard,
  leaderboard: contributorsAndLeaderboard,
  badge: HOUR * 24 * 10, // 10 Days
  learning: HOUR * 24 * 2, // 2 Days
};

module.exports = { GITHUB_CACHE_KEY, EXPIRY_TTL };
