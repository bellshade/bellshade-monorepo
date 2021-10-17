const app = require("./app");

const start = async () => {
  try {
    await app.listen(PORT, "0.0.0.0");
    console.log(`Listening on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
