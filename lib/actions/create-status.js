const updateStatus = async (status, description, context, pull_request) => {
    return context.github.repos.createStatus(
      context.repo({
        sha: pull_request.head.sha,
        state: status,
        description: description,
        context: "probot/meet-milestone"
      })
    );
};

module.exports = updateStatus;