module.exports = {
  routePrefix: "/docs",
  swagger: {
    info: {
      title: "Bellshade API",
      description:
        "Daftar isi API yang tersedia untuk menampilkan data yang diambil dari Github API untuk keperluan Organisasi Github Bellshade.",
      version: require("../package.json").version,
    },
    externalDocs: {
      url: "https://discord.gg/S4rrXQU",
      description: "Info selengkapnya, tanyakan di Discord WPU",
    },
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: true,
};
