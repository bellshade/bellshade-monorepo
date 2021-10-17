const { blacklist } = require("../config");
const { getUser, getOrgRepos, getRepoContributors } = require("../fetcher");

const getOrgContributors = () =>
  getOrgRepos() // Get all repo
    .then((data) => {
      // eliminate blacklisted repos
      const repos = data
        .map(({ name }) => name)
        .filter((r) => !blacklist.includes(r));

      return Promise.all(
        // get all contributors
        repos.map(async (repo) => {
          const allContributors = await getRepoContributors(repo);

          // Get all contributor, and filter the bot
          const contrib = {
            repo,
            contributors: allContributors
              .filter(({ type }) => type !== "Bot") // Eliminate bot
              .map((data) => ({
                login: data.login,
                contributions: data.contributions,
              })),
          };

          // Refetch user info
          const reftechUser = await Promise.all(
            contrib.contributors.map(({ login, contributions }) =>
              getUser(login).then(({ login, avatar_url, html_url, name }) => ({
                user: {
                  login,
                  name,
                  html_url,
                  avatar_url,
                },
                contributions,
              }))
            )
          );

          return {
            repo: contrib.repo,
            contributors: reftechUser,
          };
        })
      );
    });

module.exports = getOrgContributors;
