interface EXPIRY_TTL {
  members: number;
  prInfo: number;
  repos: number;
  contributors: number;
  leaderboard: number;
  badge: number;
  learning: number;
}

interface GITHUB_CACHE_KEY {
  members: string;
  repos: string;
  contributors: string;
  leaderboard: {
    pr: string;
    contribution: string;
  };
  prInfo: (username: string) => string;
  badge: {
    navigation: (type: string, text: string) => string;
  };
  learning: string;
}

interface shared {
  constant: {
    GITHUB_CACHE_KEY: GITHUB_CACHE_KEY;
    EXPIRY_TTL: EXPIRY_TTL;
  };
}

export default shared;
