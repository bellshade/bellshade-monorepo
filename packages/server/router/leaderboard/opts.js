const { user, pull_requests } = require("../../common/schema");

const contribution = {
  type: "array",
  items: {
    type: "object",
    properties: {
      user: { type: "object", properties: user },
      contributions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            contributions: { type: "number" },
            repo: { type: "string" },
          },
        },
      },
      contributions_count: { type: "number" },
    },
  },
};

const pullRequests = {
  type: "array",
  items: {
    type: "object",
    properties: {
      user: { type: "object", properties: user },
      pull_requests: {
        type: "array",
        items: { type: "object", properties: pull_requests },
      },
      prs_count: { type: "number" },
    },
  },
};

module.exports = { contribution, pullRequests };
