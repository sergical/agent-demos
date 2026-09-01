# PR Review Harness — Flue

A pull-request review agent built with [Flue](https://flueframework.com) that runs headless in a
GitHub Action.

## Architecture

One `flue run` invocation executes the `review-lead` agent against a unified diff. The lead reads
the diff with a `read_diff` tool, then delegates two parallel review passes to focused subagents —
`correctness-reviewer` and `style-reviewer`, each running a cheaper model — synthesizes their
reports into a single review, and publishes it with a `post_review` tool. In demo mode the review
lands in `review.md`; with `POST_TO_GITHUB=true` it becomes a PR comment via the GitHub API.

All model calls route through OpenRouter (Flue's built-in `openrouter/…` provider — the only
credential needed is `OPENROUTER_API_KEY`).

```
src/agents/review.ts    review-lead agent + both subagents + tools
fixtures/sample.diff    A diff with seeded correctness and style problems
fixtures/fix.diff       A diff that FIXES those problems
github-workflow/review.yml   The GitHub Actions workflow
```

## Setup

Requires Node >= 22.19.0.

```sh
npm install
cp .env.example .env   # then fill in OPENROUTER_API_KEY
```

## Run

```sh
npm run demo             # review fixtures/sample.diff
npm run demo:fix         # review fixtures/fix.diff — the fixed version of the same diff
npm run demo:tool-error  # review a path that does not exist — the tool-failure path
```

`npm run demo` runs the whole harness against `fixtures/sample.diff` (the fixture hides an
off-by-one retry loop, a dropped `response.ok` check, and assorted style problems for the subagents
to find) and writes the finished review to `review.md`. Progress streams to stderr; the final
verdict prints to stdout. Exit code 0 means the submission completed — a failed agent fails the CI
step naturally.

`npm run demo:fix` reviews the diff that repairs those defects.

`npm run demo:tool-error` asks for `fixtures/latest.diff`, which does not exist. The `read_diff`
tool throws, and the failure lands in two places: the error text goes back to the model as the
tool result, and the agent recovers by falling back to `fixtures/sample.diff`.

### In GitHub Actions

Copy `github-workflow/review.yml` to `.github/workflows/review.yml` of the repository you want
reviewed (it belongs there — GitHub only picks workflows up from that directory) and add
`OPENROUTER_API_KEY` as a repository secret. On every PR the workflow exports the diff with
`gh pr diff`, runs the agent, and posts the review as a PR comment using the workflow-provided
`GITHUB_TOKEN`.
