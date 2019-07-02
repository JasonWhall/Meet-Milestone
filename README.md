# Meet-Milestone

> A GitHub App built with [Probot](https://github.com/probot/probot) that checks the milestone matches the minimum semantic version.
> This expects the Milestone to be valid semver <https://semver.org/>

## Setup

### Local Development

```sh
# Install dependencies & Run the bot
npm install && npm run dev
```

### Production

```sh
# Install dependencies & Run the bot
npm install && npm start
```

- Go to <http://HOSTNAME:3000>
- Follow the [Probot docs](https://probot.github.io/docs/) to register the application.

## Environment Variables

There are several variables set at runtime that this Probot uses. an example can be found [here](./.env.example)

```text
ATLASSIAN_USER
ATLASSIAN_TOKEN
```

These variables are both required to build the credentials to connect to Jira.

## Repo Configuration

To allow Probot to use the repo, it is expecting a file to exist in `.github/meet-milestone.json`

This will need to contain a file with the following configuration:

```json
{
  "atlassianProject": "ProjectID",
  "baseBranch": "master",
  "jiraBase": "https://your-jira.atlassian.net/rest/api/3/"
}
```
