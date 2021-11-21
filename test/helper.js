const Fastify = require("fastify");
const fp = require("fastify-plugin");

const { main, leaderboard } = require("../router");

const forRegister = fp((fastify, opts, done) => {
  const cachePreHandler = require("../common/cachePreHandler")(fastify);

  fastify.register(require("../plugin/cacheAndConstant"));
  fastify.register(require("../plugin/errorHandler"));

  fastify.register(main(cachePreHandler));
  fastify.register(leaderboard(cachePreHandler), { prefix: "/leaderboard" });

  done();
});

function build() {
  const app = Fastify();

  beforeAll(async () => {
    await app.register(forRegister);
    await app.ready();
  });

  afterAll(() => app.close());

  return app;
}

module.exports = build;
