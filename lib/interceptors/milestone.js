const getPullRequest = async context => {
  if (valid(context)) {
    let res = await context.github.pullRequests.get(
      context.repo({ number: context.payload.issue.number })
    );
    return res.data;
  }
};

const valid = context => {
  /* 
  GH does not differentiate between issues and pulls for milestones. The only differentiator
  is the payload for issues containing a pull_request property.
  */
  return (
    context.event === "issues" &&
    (context.payload.action === "milestoned" ||
      context.payload.action === "demilestoned") &&
    !!context.payload.issue.pull_request
  );
};

module.exports = getPullRequest;
