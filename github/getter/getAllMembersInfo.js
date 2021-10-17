const { getMembers, getUser } = require("../fetcher");

const getAllMembersInfo = () =>
  getMembers()
    // re-get member data
    .then((data) => Promise.all(data.map((users) => getUser(users.login))))
    .then((members) =>
      members.map((member) => ({
        login: member.login,
        name: member.name,
        html_url: member.html_url,
        avatar_url: member.avatar_url,
      }))
    );

module.exports = getAllMembersInfo;
