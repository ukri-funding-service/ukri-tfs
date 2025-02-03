# UKRI Funding Service

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

## Getting Started

This is the UKRI TFS codebase.
It includes the packages neccesary to run the TFS system.

Use npm run bootstrap to install dependancies.
npm run build to build packages
and npm run test to run unittests

## Conventional Commits

This repository uses [Conventional Commits](https://www.conventionalcommits.org/) as the standard format for commit messages.

For convenience, a root script is available which prompts for the appropriate boilerplate: `npm run cmt`

NOTE: this script is not named 'commit' as this causes precommit hooks to be executed twice by npm.

See [this guide](https://devops.innovateuk.org/documentation/display/UFSB/Conventional+Commits) for examples of how to format commit messages for this project.