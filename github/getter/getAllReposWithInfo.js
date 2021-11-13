const { getOrgRepos } = require("../fetcher");
const { blacklist } = require("../config");

const getAllReposWithInfo = () =>
  getOrgRepos().then((repos) =>
    repos
      // Filter blacklisted repo
      .filter((repo) => !blacklist.includes(repo.name))
      // serve just enough repo data
      .map((repo) => ({
        name: repo.name,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        license: repo.license
          ? {
              key: repo.license.key,
              name: repo.license.name,
              spdx_id: repo.license.spdx_id,
            }
          : null,
        topics: repo.topics,
      }))
  );

module.exports = getAllReposWithInfo;
