const { blacklist } = require("../config");
const { getUser, getOrgRepos, getRepoContributors } = require("../fetcher");

const getOrgContributors = () =>
  getOrgRepos() // Get all repo
    .then((data) =>
      // eliminate blacklisted repos
      data.map(({ name }) => name).filter((r) => !blacklist.includes(r))
    )
    .then((repos) =>
      Promise.all(
        repos.map(async (repo) => {
          const allContributors = await getRepoContributors(repo);

          return {
            repo,
            contributors: allContributors
              .filter(({ type }) => type !== "Bot") // Eliminate bot
              .map((data) => ({
                login: data.login,
                contributions: data.contributions,
              })),
          };
        })
      )
    )
    .then((contribs) =>
      Promise.all(
        contribs.map(async (contrib) => {
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
      )
    );

module.exports = getOrgContributors;
