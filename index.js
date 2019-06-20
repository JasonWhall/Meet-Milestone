const { serverless } = require("@probot/serverless-gcf");
const appFn = require("./probot.js");
module.exports.probot = serverless(appFn);
