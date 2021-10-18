const app = require("./app");

const PORT = process.env.PORT || 3000;

app.ready((err) => {
  if (err) throw err;
  app.swagger();
});

const start = async () => {
  try {
    await app.listen(PORT, "0.0.0.0");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
