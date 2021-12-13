const guide = {
  type: "array",
  items: {
    type: "object",
    properties: {
      repo: { type: "string" },
    },
  },
};

const tree = {
  type: "array",
  items: {
    type: "object",
    properties: {
      path: { type: "string" },
      type: { type: "string" },
    },
  },
};

const errorData = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

module.exports = { guide, tree, errorData };
