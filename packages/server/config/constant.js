const HOUR = 3600;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const contributorsAndLeaderboard = DAY * 5;

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

// Expiry times
const EXPIRY_TTL = {
  members: WEEK * 2, // 2 Weeks
  prInfo: HOUR * 5, // Keep it 5 Hours
  repos: WEEK,
  contributors: contributorsAndLeaderboard,
  leaderboard: contributorsAndLeaderboard,
  badge: WEEK * 3, // 3 Weeks
  learning: contributorsAndLeaderboard, // Using same time configuration
};

module.exports = { GITHUB_CACHE_KEY, EXPIRY_TTL };
