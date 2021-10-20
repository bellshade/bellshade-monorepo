const { user, pull_requests } = require("../../common/schema");

const members = {
  type: "array",
  items: { type: "object", properties: user },
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

module.exports = { members, contributors, prCheck };
