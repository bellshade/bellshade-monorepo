const { SimpleIntervalJob, AsyncTask } = require("toad-scheduler");
const moment = require("moment");

const {
  getAllMembersInfo,
  getOrgContributors,
  getLeaderboard,
} = require("../github");
const hook = require("../helpers/hook");

const format = "**DD MMMM YYYY HH:mm:ss UTC**";

const getTime = (seconds) => {
  const now = moment.utc();

  return {
    now: now.format(format),
    next: now.add(seconds, "s").format(format), // 'h' => hour
  };
};

const sender = (message, time) =>
  hook.send(
    `${message
      .replace("SCHEDULER", "**SCHEDULER**")
      .replace("[SUCCESS]", " :white_check_mark:")} \n\nFetched at ${
      time.now
    }\nNext Data Fetch at ${time.next}

Sended from \`task/init.js\`.
    `
  );

const { GITHUB_CACHE_KEY, EXPIRY_TTL } = require("../config/constant");
const runImmediately = true;

const init = (fastify) => {
  const cache = fastify.cache;

  const commonErrorHandler = (err) => {
    const errorData = Object.values(err.response.data);

    fastify.log.error(errorData.join(" "));
    hook.send(
      `[**SCHEDULER**]\t:red_circle:  ERROR  :red_circle:
Timestamp: ${moment.utc().format(format)}

${
  errorData.length > 0
    ? errorData.join("\n")
    : `
\`\`\`json
${JSON.stringify(err)}
\`\`\`
`
}

Sended from \`task/init.js\``
    );
  };

  const {
    PR: PullRequestLeaderboard,
    CONTRIB: ContributionLeaderboard,
  } = getLeaderboard(cache);

  const getMembers = (() => {
    const task = new AsyncTask(
      "Get Bellshade public members",
      () =>
        getAllMembersInfo().then((data) => {
          const message = "[SCHEDULER] Get Pull Request Leaderboard [SUCCESS]";
          const time = getTime(EXPIRY_TTL.members);

          cache.set(GITHUB_CACHE_KEY.members, data, EXPIRY_TTL.members);

          fastify.log.info(message);
          sender(message, time);
        }),
      commonErrorHandler
    );

    return new SimpleIntervalJob(
      { seconds: EXPIRY_TTL.members, runImmediately },
      task
    );
  })();

  const orgContributors = (() => {
    const task = new AsyncTask(
      "Get Bellshade Contributors and Contribution Leaderboard",
      () =>
        Promise.all([getOrgContributors(), ContributionLeaderboard()]).then(
          ([contributors, contribLeaderboard]) => {
            const message =
              "[SCHEDULER] Get Bellshade Contributors and Contribution Leaderboard [SUCCESS]";
            const time = getTime(EXPIRY_TTL.contributors);

            cache.set(
              GITHUB_CACHE_KEY.contributors,
              contributors,
              EXPIRY_TTL.contributors
            );
            cache.set(
              GITHUB_CACHE_KEY.leaderboard.contribution,
              contribLeaderboard,
              EXPIRY_TTL.leaderboard
            );

            fastify.log.info(message);
            sender(message, time);
          }
        ),
      commonErrorHandler
    );

    return new SimpleIntervalJob(
      { seconds: EXPIRY_TTL.contributors, runImmediately },
      task
    );
  })();

  const PRLeaderboard = (() => {
    const task = new AsyncTask(
      "Get Pull Request Leaderboard",
      () =>
        PullRequestLeaderboard().then((data) => {
          const message = "[SCHEDULER] Get Pull Request Leaderboard [SUCCESS]";
          const time = getTime(EXPIRY_TTL.leaderboard);

          cache.set(
            GITHUB_CACHE_KEY.leaderboard.pr,
            data,
            EXPIRY_TTL.leaderboard
          );

          fastify.log.info(message);
          sender(message, time);
        }),
      commonErrorHandler
    );

    return new SimpleIntervalJob(
      { seconds: EXPIRY_TTL.leaderboard, runImmediately },
      task
    );
  })();

  return [getMembers, orgContributors, PRLeaderboard];
};

module.exports = init;
