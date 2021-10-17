const app = require("./app");
const init = require("./task/init");

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await app.listen(PORT, "0.0.0.0");
    console.log(`Listening on port ${PORT}`);

    init(app);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
