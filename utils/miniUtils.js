const queryBuilder = (username) =>
  `+type:pr+is:public+is:merged+draft:false+author:${username}+org:bellshade`;

module.exports = (octokit) => {
  const getMembers = () =>
    octokit.orgs
      .listPublicMembers({ org: "bellshade" })
      .then(({ data }) => data);

  const getUser = (username) =>
    octokit.users.getByUsername({ username }).then(({ data }) => data);

  const getPublicEvents = (username) =>
    octokit.activity
      .listPublicEventsForUser({
        username,
        per_page: 100,
      })
      .then(({ data }) => data);

  const getPR = ({ owner, repo, pull_number }) =>
    octokit.rest.pulls
      .get({
        owner,
        repo,
        pull_number,
      })
      .then(({ data }) => data);

  const searchPRs = (username) =>
    octokit.search
      .issuesAndPullRequests({
        q: queryBuilder(username),
        per_page: 100,
      })
      .then(({ data }) => data.items);

  return { getMembers, getUser, searchPRs, getPR };
};
