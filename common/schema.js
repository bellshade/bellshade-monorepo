const schema = {
  user: {
    login: { type: "string" },
    name: { type: "string" },
    html_url: { type: "string" },
    avatar_url: { type: "string" },
  },
  pull_requests: {
    title: { type: "string" },
    html_url: { type: "string" },
    number: { type: "number" },
    created_at: { type: "string" },
    merged_at: { type: "string" },
    repo_name: { type: "string" },
  },
};

module.exports = schema;
