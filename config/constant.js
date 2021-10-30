const HOUR = 3600;

const contributorsAndLeaderboard = HOUR * 20;

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
  members: HOUR * 18,
  prInfo: HOUR * 5,
  contributors: contributorsAndLeaderboard,
  leaderboard: contributorsAndLeaderboard,
};

module.exports = { GITHUB_CACHE_KEY, EXPIRY_TTL };
