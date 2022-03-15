if (process.env.NODE_ENV !== "production") require("dotenv").config();

const hook = require("./hook");
const octokit = require("./octokit");

module.exports = { hook, octokit };
