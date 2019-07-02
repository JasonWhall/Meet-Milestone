semver = require("semver");

const getMilestones = async context => {
  const res = await context.github.issues.listMilestonesForRepo(
    context.repo({
      state: "open"
    })
  ).then(
      result => result.data
      .filter(result => semver.valid(result.title))
      .map(result => result.title)
  )
  return res;
};

module.exports = getMilestones;
