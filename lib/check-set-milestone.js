semver = require("semver");
getPullRequest = require("./interceptors/milestone");
updateStatus = require("./actions/create-status");
getMilestones = require("./utils/get-milestones");

const checkSetMilestone = async context => {
  // Determine whether Milestone or Pull request.
  const pull_request = context.payload.pull_request
    ? context.payload.pull_request
    : await getPullRequest(context);

  const config = await context.config("meet-milestone.json");

  // Do not perform check if there is no config in the repo
  if (!config) {
    context.log(
      `${context.payload.repository.full_name} missing configuration file`
    );
    return;
  }

  // Issue has been milestoned/de-milestoned and has no pull request, no need to check
  if (!pull_request) {
    return;
  }

  let state = "success";

  // Only perform checks on configured branch
  if (config.baseBranch != pull_request.base.ref) {
    context.log(`${pull_request.base.ref} not valid branch to check`);
    return updateStatus(state, "No Check Required", context, pull_request);
  }

  // Get versions in jira
  const jiraurl = `${config.jiraBase}project/${
    config.atlassianProject
  }/versions`;

  // check semver to find nearest release and check against pr
  versions = await getMilestones(context);
  let currRelease = semver.minVersion(versions.join("||")).raw;

  if (
    (pull_request.base.ref === config.baseBranch &&
      pull_request.milestone &&
      pull_request.milestone.title &&
      currRelease == pull_request.milestone.title) ||
    pull_request.title.includes("skip-milestone")
  ) {
    state = "success";
    description = "Passed!";
  } else {
    state = "failure";
    description = `Invalid milestone. Currently targeting ${currRelease}`;
  }

  return updateStatus(state, description, context, pull_request);
};

module.exports = checkSetMilestone;
