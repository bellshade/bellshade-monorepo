const { getMembers, getUser } = require("../fetcher");

const getAllMembersInfo = () =>
  getMembers().then(async (data) => {
    try {
      const members = await Promise.all(
        data.map((users) => getUser(users.login))
      );

      return members.map((member) => ({
        login: member.login,
        name: member.name,
        html_url: member.html_url,
        avatar_url: member.avatar_url,
      }));
    } catch (err) {
      return Promise.reject(err);
    }
  });

module.exports = getAllMembersInfo;
