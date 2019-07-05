checkSetMilestone = require("./lib/check-set-milestone");

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  app.on(
    [
      "pull_request.opened",
      "pull_request.edited",
      "pull_request.synchronize",
      "pull_request.labeled",
      "pull_request.unlabeled",
      "pull_request.reopened",
      "issues.milestoned",
      "issues.demilestoned"
    ],
    context => checkSetMilestone(context)
  );
};
