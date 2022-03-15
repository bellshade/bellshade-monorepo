const blacklist = require("../config/blacklistedRepos");
const { getUser, searchPRs } = require("../fetcher");
const { leaderboardQuery } = require("../config").query;
const getOrgContributors = require("./getOrgContributors");

const {
  constant: { GITHUB_CACHE_KEY, EXPIRY_TTL },
} = require("@bellshade/shared");

const getLeaderboard = (cache) => ({
  PR: () =>
    searchPRs(leaderboardQuery).then((PRs) => {
      const usernames = [...new Set(PRs.map((data) => data.user.login))].filter(
        (user) => !user.includes("[bot]")
      ); // list all username, remove duplicate username
      const filteredByUser = usernames // sort users pr
        .map((username) => ({
          username,
          PRs: PRs.filter(({ user }) => user.login === username).filter(
            ({ repository_url }) => {
              const splitted = repository_url.split("/");

              return !blacklist.includes(splitted[splitted.length - 1]);
            }
          ),
        }))
        .sort((a, b) => b.PRs.length - a.PRs.length);

      const tops = filteredByUser.slice(0, 30); // Top 30 PR Bellshade

      // Get all users info
      return Promise.all(
        tops.map(async (top) => ({
          user: await getUser(top.username).then(
            ({ login, avatar_url, html_url, name }) => ({
              login,
              name,
              html_url,
              avatar_url,
            })
          ),
          pull_requests: top.PRs.map((pr) => {
            const splitted = pr.repository_url.split("/");

            return {
              title: pr.title,
              html_url: pr.html_url,
              number: pr.number,
              created_at: pr.created_at,
              merged_at: pr.closed_at,
              repo: splitted[splitted.length - 1],
            };
          }),
          prs_count: top.PRs.length,
        }))
      );
    }),
  CONTRIB: () =>
    new Promise((resolve, reject) => {
      (async () => {
        try {
          // load existing cache, if exist
          const dataCache = cache.get(GITHUB_CACHE_KEY.contributors);
          const data = dataCache ? dataCache : await getOrgContributors();

          // caching contributors data when it's not available
          if (!dataCache)
            cache.set(
              GITHUB_CACHE_KEY.contributors,
              data,
              EXPIRY_TTL.contributors
            );

          const remapNewData = data
            .map(({ repo, contributors }) =>
              contributors.map((contributor) => ({ ...contributor, repo }))
            )
            .reduce((curr, acc) => curr.concat(acc))
            .filter(({ repo }) => !blacklist.includes(repo));

          const usernames = [
            ...new Set(remapNewData.map(({ user }) => user.name)),
          ];
          const remapUsers = usernames.map((username) => {
            const userData = remapNewData.filter(
              ({ user }) => user.name === username
            );
            const contributions = userData.map(({ contributions, repo }) => ({
              contributions,
              repo,
            }));

            const contributionsCount = contributions
              .map(({ contributions }) => contributions)
              .reduce((curr, acc) => curr + acc);

            return {
              user: userData[0].user,
              contributions,
              contributions_count: contributionsCount,
            };
          });

          const top = remapUsers
            .sort((a, b) => b.contributions_count - a.contributions_count)
            .slice(0, 30);

          resolve(top);
        } catch (error) {
          reject(error);
        }
      })();
    }),
});

module.exports = getLeaderboard;
