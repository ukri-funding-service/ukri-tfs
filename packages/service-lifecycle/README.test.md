# Testing

This module uses [Jest](https://jestjs.io/) as its unit test framework.

## Running tests

### Unit tests without reporting _(recommended)_

`npx lerna run test --scope=@ukri-tfs/service-lifecycle`

### Unit tests with reporting _(used in CI)_

_NOTE: significantly slower than without reporting - see "Test reporters" below_

`npx lerna run test:ci --scope=@ukri-tfs/service-lifecycle`

### Coverage & unit tests

_NOTE: the slowest form of test - see "Test reporters" below_

`npx lerna run test:coverage --scope=@ukri-tfs/service-lifecycle`

## Test reporters

Jest allows the configuration of [test reporters](https://jestjs.io/docs/configuration) which are hooks that can generate
status and summary information during and after testing.

Test reporters can create a significant performance drop in the test execution speed,
and should only be enabled when necessary. For this reason, the default config has no
reporters enabled.

If a specific reporter is required, it should be enabled through an
opt-in config file rather than added to the default jest config.

A specific config file for executing tests in CI is provided (`jest.config.ci.js`) which extends the default
config to enable reporting and summary information to allow log retention, but this
should not generally be used in development.

To execute jest with a non-default config, use `jest --config <custom config file>`
