const HOUR = 3600;

const GITHUB_CACHE_KEY = {
  members: "gh_bellshade_members",
  contributors: "gh_bellshade_contributors",
  leaderboard: {
    all: "gh_bellshade_leaderboard",
    pr: "gh_bellshade_lbrd_pr",
    contribution: "gh_bellshade_lbrd_contrib",
  },
  prInfo: (username) => `pr_info_user:${username}`,
};
const EXPIRY_TTL = {
  members: HOUR * 5,
  prInfo: HOUR * 1.5,
  contributors: HOUR * 12,
  leaderboard: HOUR * 12,
};

module.exports = { GITHUB_CACHE_KEY, EXPIRY_TTL };
