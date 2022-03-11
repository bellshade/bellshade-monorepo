const leaderboardQuery =
  "+type:pr+is:public+is:merged+draft:false+org:bellshade";
const bellshadeContributorQuery = (username) =>
  `+type:pr+is:public+is:merged+draft:false+author:${username}+org:bellshade`;

module.exports = { leaderboardQuery, bellshadeContributorQuery };
