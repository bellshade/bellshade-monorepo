const fp = require("fastify-plugin");

module.exports = fp((fastify, opts, done) => {
  fastify.addSchema({
    $id: "UserSchema",
    $type: "object",
    properties: {
      login: { type: "string" },
      name: { type: "string" },
      html_url: { type: "string" },
      avatar_url: { type: "string" },
    },
  });

  fastify.addSchema({
    $id: "PRSchema",
    $type: "object",
    properties: {
      title: { type: "string" },
      html_url: { type: "string" },
      number: { type: "number" },
      created_at: { type: "string" },
      merged_at: { type: "string" },
    },
  });

  done();
});
