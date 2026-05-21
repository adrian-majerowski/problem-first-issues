# Feature Handoff CLI

A small CLI that adds a problem-first feature handoff issue template to a GitHub repository.

## Why It Exists

Teams often create feature issues without enough context. This template helps PMs explain the problem, evidence, outcome, constraints, and example solution before design or engineering starts.

## Usage

```bash
npx feature-handoff init
```

Then commit the generated files:

```bash
git add .github/ISSUE_TEMPLATE
git commit -m "Add feature handoff issue template"
git push
```

## What Gets Created

```text
.github/ISSUE_TEMPLATE/feature-handoff.yml
.github/ISSUE_TEMPLATE/config.yml
```

The Feature Handoff issue form guides PMs to describe the user problem before proposing a feature.

## Options

```bash
feature-handoff init --force
feature-handoff init --no-config
```

`--force` overwrites existing generated files.

`--no-config` creates only the Feature Handoff issue form and skips `config.yml`.

## Philosophy

```text
No feature without a problem.
```
