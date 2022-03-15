const fp = require("fastify-plugin");
const { socket: controller } = require("../controllers");

module.exports = fp((fastify, opts, done) => {
  const socketController = controller(fastify.statics);

  fastify.register(require("fastify-socket.io")).after(() => {
    fastify.io.on("connection", (socket) => {
      socket.on("file:run", (data) =>
        socketController.emit("file:run", socket, data)
      );
    });
  });

  done();
});
