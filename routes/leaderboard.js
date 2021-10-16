const express = require("express");

const { getLeaderboard } = require("../github");
const commonErrorHandler = require("../common/errorHandler");
const { GITHUB_CACHE_KEY, EXPIRY_TTL } = require("../config/constant");

const routerContainer = (cache) => {
  const router = express.Router();

  router.get("/pr", (req, res) => {
    const dataCache = cache.get(GITHUB_CACHE_KEY.leaderboard.pr);
    if (dataCache) return res.json(dataCache);

    getLeaderboard
      .PR()
      .then((data) => {
        cache.set(
          GITHUB_CACHE_KEY.leaderboard.pr,
          data,
          EXPIRY_TTL.leaderboard
        );
        res.json(data);
      })
      .catch(commonErrorHandler(res));
  });

  return router;
};

module.exports = routerContainer;
