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

  let state = "pending";

  updateStatus(state, "Checking Milestone", context, pull_request);

  state = "success";

  // Only perform checks on configured branch
  if (config.baseBranch != pull_request.base.ref) {
    context.log(`${pull_request.base.ref} not valid branch to check`);
    return updateStatus(state, "No Check Required", context, pull_request);
  } 

  // check semver to find nearest release and check against pr
  const versions = await getMilestones(context);

  // Gets current list of branches
  const branches = await context.github.repos.listBranches(
    context.repo()
  ).then(result =>
    result.data.map(res => res.name)
  )

  // Keep only versions that do not have a release candidate branch
  const validVersions = versions.filter(version => !branches.includes(`release/${version}`))

  // Get nearest release version
  const currRelease = semver.minVersion(validVersions.join("||")).raw;

  // Get Labels to see if we should skip the check.
  const labels = pull_request.labels.map(label => label.name)

  if (
    (pull_request.base.ref === config.baseBranch &&
      pull_request.milestone &&
      currRelease == pull_request.milestone.title) ||
      labels.includes("skip-ci")
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
