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
      "issues.milestoned",
      "issues.demilestoned"
    ],
    context => checkSetMilestone(context)
  );
};
