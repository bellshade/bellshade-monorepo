const commonErrorHandler = (res) => (error) =>
  res
    .status(!error ? 500 : error.status)
    .json(
      !error ? { error: true, message: "Unknown Error" } : error.response.data
    );

module.exports = commonErrorHandler;
