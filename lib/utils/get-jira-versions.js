axios = require("axios");
semver = require("semver");

const getJiraVersions = async jiraurl => {
  const authheader = Buffer.from(
    `${process.env.ATLASSIAN_USER}:${process.env.ATLASSIAN_TOKEN}`
  ).toString("base64");

  result = await axios
    .get(jiraurl, {
      headers: {
        Authorization: `Basic ${authheader}`,
        "Content-Type": "application/json"
      }
    })
    .then(result =>
      result.data
        .filter(result => semver.valid(result.name) && !result.released)
        .map(result => result.name)
    );
  return result;
};

module.exports = getJiraVersions;
