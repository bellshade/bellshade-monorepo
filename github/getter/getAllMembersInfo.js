const { getMembers, getUser } = require("../fetcher");

const getAllMembersInfo = () =>
  getMembers()
    // re-get member data
    .then((data) => Promise.all(data.map((users) => getUser(users.login))))
    .then((members) =>
      members.map((member) => ({
        login: member.login,
        avatar_url: member.avatar_url,
        html_url: member.html_url,
        name: member.name,
      }))
    );

module.exports = getAllMembersInfo;
