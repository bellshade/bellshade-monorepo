"use strict";
const fastify = require("fastify");
const path = require("path");

const autoLoad = require("fastify-autoload");
const constant = require("./config/constant");

const app = fastify({ debug: false });
const port = process.env.PORT || 3000;

const appConstructor = ({ folders, title }) => {
  app
    .register((fastify, opts, done) => {
      const requiredStatic = [
        ...constant.requiredStatic,
        ...folders.map((staticFolder) => ({
          root: path.join(constant.ROOT, staticFolder),
          prefix: `/static/${staticFolder}/`,
        })),
      ];

      // inisialisasi sebelum seluruh plugin di daftarkan
      app.decorate("title", title);
      app.decorate("statics", folders);
      app.decorate("requiredStatic", requiredStatic);

      done();
    })
    .after(() => {
      app.register(autoLoad, {
        dir: path.join(__dirname, "plugins"),
      });
    });

  const start = async () => {
    await app.listen(port, "0.0.0.0");
    console.log(`Listening on port ${port} | http://localhost:${port}/`);
  };

  return start;
};

module.exports = appConstructor;
