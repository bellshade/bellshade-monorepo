const cachePreHandler = (fastify) => (key) => (req, reply, done) => {
  const dataCache = fastify.cache.get(key);
  if (dataCache) return reply.send(dataCache);

  done();
};

module.exports = cachePreHandler;
