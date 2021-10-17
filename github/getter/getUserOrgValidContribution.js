const { searchPRs, getUser } = require("../fetcher");
const { bellshadeContributorQuery } = require("../config").query;

const getUserOrgValidContribution = (username) =>
  // Search All merged PR entire bellshade github org
  searchPRs(bellshadeContributorQuery(username)).then((PRs) => {
    // Remap all pull request
    const pull_requests = PRs.map((pr) => ({
      title: pr.title,
      html_url: pr.html_url,
      number: pr.number,
      created_at: pr.created_at,
      merged_at: pr.closed_at,
    }));

    return getUser(username).then(({ login, avatar_url, html_url, name }) => ({
      user: { login, name, html_url, avatar_url },
      pull_requests: pull_requests.length > 0 ? pull_requests : null,
      prs_count: pull_requests.length,
    }));
  });

module.exports = getUserOrgValidContribution;
