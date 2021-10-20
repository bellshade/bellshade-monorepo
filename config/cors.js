const localhostOnly = (...ports) =>
  ports.map((port) => `http://localhost:${port}`);

const allowList = [
  new RegExp("https://(.*?).bellshade.org"),
  ...localhostOnly(3000, 3001, 5000),
  new RegExp("https://(.*?).github.io"),
];

module.exports = {
  origin: (origin, callback) => {
    const isPermitted = allowList.some((e) => {
      const tester =
        e instanceof RegExp ? (o) => e.test(o) : (o) => e.indexOf(o) !== -1;

      return origin !== undefined ? tester(origin) : true;
    });

    if (isPermitted) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET"],
};
