const app = require("./app");

const PORT = process.env.PORT || 3000;

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
