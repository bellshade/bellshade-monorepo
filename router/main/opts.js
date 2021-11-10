const { user, pull_requests } = require("../../common/schema");

const members = {
  type: "array",
  items: { type: "object", properties: user },
};

const repos = {
  type: "array",
  items: {
    properties: {
      name: { type: "string" },
      html_url: { type: "string" },
      stargazers_count: { type: "number" },
      forks_count: { type: "number" },
      license: {
        type: "object",
        properties: {
          key: { type: "string" },
          name: { type: "string" },
          spdx_id: { type: "string" },
        },
        nullable: true,
      },
      topics: {
        type: "array",
      },
    },
  },
};

const contributors = {
  type: "array",
  items: {
    properties: {
      repo: { type: "string" },
      contributors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            user: { type: "object", properties: user },
            contributions: { type: "number" },
          },
        },
      },
    },
  },
};

const prCheck = {
  type: "object",
  properties: {
    user: { type: "object", properties: user },
    pull_requests: {
      type: "array",
      items: { type: "object", properties: pull_requests },
    },
    prs_count: { type: "number" },
  },
};

module.exports = { members, repos, contributors, prCheck };
