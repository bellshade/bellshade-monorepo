const fp = require("fastify-plugin");
const {
  request: { onError },
} = require("../discord/messageBuilder");

module.exports = fp((fastify, opts, done) => {
  fastify.decorate("APIerrorHandler", (request, reply) => (error) => {
    reply.code(error.status).send(error.response.data);

    onError({
      stack: error.stack,
      url: request.url,
      error: JSON.stringify({ stack: error.stack, error }, null, 2),
      time: new Date(),
    });
  });

  done();
});
