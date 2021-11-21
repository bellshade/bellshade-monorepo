const { octokit } = require("../../helpers");

const getPageLinks = require("./getPageLinks");
const hasNextPage = require("./hasNextPage");

const getNextPage = (response, pullRequestData) =>
  new Promise(async (resolve, reject) => {
    const nextPageLink = getPageLinks(response).next.replace(
      "https://api.github.com",
      ""
    );

    const githubResults = await octokit.request("GET " + nextPageLink);
    const newPullRequestData = pullRequestData.concat(githubResults.data.items);

    if (hasNextPage(githubResults)) {
      const data = await getNextPage(githubResults, newPullRequestData);
      resolve(data);
    }

    resolve(newPullRequestData);
  });

module.exports = getNextPage;
