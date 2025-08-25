## Test workflows locally with [act](https://github.com/nektos/act)

Act is used for testing github workflows locally using docker. It can be setup in various ways. We'll preferably use github extension as other ways requires go-tools and act-cli to be installed on your machine.

1. Install github cli `gh extension install https://github.com/nektos/gh-act`.

2. Run `gh act` to install docker image for the runner. Select medium image.

3. List workflows `gh act -l`.

4. Create `.secrets` file in project root. This simulates github secrets locally.

5. Run workflow `gh act --job <job-name>`.

Note - Do not put secrets anywhere else, or your personal credentials could be exposed with `git push`.