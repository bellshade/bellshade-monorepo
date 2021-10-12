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

  return { getMembers, getUser, getPublicEvents, getPR };
};
