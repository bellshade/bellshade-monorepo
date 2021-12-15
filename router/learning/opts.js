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

module.exports = { tree, errorData };
