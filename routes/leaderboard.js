const express = require("express");

const { getLeaderboard } = require("../github");
const commonErrorHandler = require("../common/errorHandler");
const { GITHUB_CACHE_KEY, EXPIRY_TTL } = require("../config/constant");

const routerContainer = (cache) => {
  const { PR, CONTRIB } = getLeaderboard(cache);
  const router = express.Router();

  router.get("/pr", (req, res) => {
    const dataCache = cache.get(GITHUB_CACHE_KEY.leaderboard.pr);
    if (dataCache) return res.json(dataCache);

    PR()
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

  router.get("/contribution", (req, res) => {
    const dataCache = cache.get(GITHUB_CACHE_KEY.leaderboard.contribution);
    if (dataCache) return res.json(dataCache);

    CONTRIB()
      .then((data) => {
        cache.set(
          GITHUB_CACHE_KEY.leaderboard.contribution,
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
