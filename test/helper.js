const Ajv = require("ajv");
const Fastify = require("fastify");
const fp = require("fastify-plugin");

const { main, leaderboard, badge } = require("../router");

const forRegister = fp((fastify, opts, done) => {
  const cachePreHandler = require("../common/cachePreHandler")(fastify);

  fastify.register(require("../plugin/cacheAndConstant"));
  fastify.register(require("../plugin/errorHandler"));

  fastify.register(main(cachePreHandler));
  fastify.register(leaderboard(cachePreHandler), { prefix: "/leaderboard" });
  fastify.register(badge, { prefix: "/badge" });

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

const isObject = (obj) =>
  Object.prototype.toString.call(obj) === "[object Object]";

const ajv = new Ajv({
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  nullable: true,
});

const _testBuilder = (app) => (url, schema, cacheKey) => async () => {
  const response = await app.inject({ method: "GET", url });
  const parsed = JSON.parse(response.body);

  const isArrayOfObject =
    Array.isArray(parsed) && parsed.map(isObject).every((e) => e === true);
  const valid = ajv.validate(schema, parsed);
  const dataCache = app.cache.get(cacheKey);

  expect(response.statusCode).toBe(200);
  expect(isArrayOfObject).toBeTruthy();
  expect(valid).toBeTruthy();
  expect(dataCache).toEqual(parsed);
};

module.exports = { build, ajv, _testBuilder };
