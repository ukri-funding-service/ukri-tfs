# UKRI-Test-Framework

# User Guide

To install the test framework you need to install the module to your project

```bash
$ npm install ukri-test-framework --save-dev
```

After this you can run

```bash
$ yarn run installTestModule
```

This will give you the selection of API/UI/Performance to install, after selecting your required framework, everything is setup.

# Developers Guide

The git repository can be found here: [ukri-test-framework](https://devops.innovateuk.org/code-repository/projects/UKRI/repos/ukri-test-framework/browse").

## Running tests

Run all API compoenent tests

```bash
$ npm run test:component
```

Run all API integration tests

```bash
$ npm run test:API:integration
```

Run all API tests

```bash
$ npm run test:API:all
```

Run all API tests with a specific tag

```bash
$ npm run test:API:tag
```

Run all API tests with debugging

```bash
$ npm run test:API:debug
```

Run all UI tests on chrome HEADLESS

```bash
$ npm run test:UI
```

Run all UI tests on chrome

```bash
$ npm run test:UI:chrome
```

Run all UI tests on firefox

```bash
$ npm run test:UI:firefox
```

Run all UI tests using custom profile

```bash
$ npm run test:UI:tag
```

Run Performance tests

```bash
$ npm run test:performance
```

## Docker

### Building Docker image

There are two options for building a Docker image.

Locally, using the local src of ukri-test-framework:

```bash
npm run docker:build:local
```

Remote, using the npm package from Nexus:

```bash
# Needs to authenticate with Nexus, so export your auth token from `~/.npmrc`:
export NPM_TOKEN=NpmToken.abc123-abc123-abc123-abc123
npm run docker:build
```

### Using Docker image

The docker image has the `ukri-test-framework` as the entrypoint, so to use the image, simply provide the cmd for the framework to run, along with the `tests` directory mounted into it and the `_results_` directory to store the results, and any env vars needed for the tests.
E.g.:

```bash
docker run -it \
            -v $(pwd)/tests:/usr/src/app/tests \
            -v $(pwd)/_results_:/usr/src/app/_results_ \
            --env SERVICE_URL=https://api:3001 \
            --env BABEL_CACHE_PATH=/tmp/babel-cache.json \
            docker-tfs.devops.innovateuk.org/tfs/ukri-test-framework:latest \
                test:API:GRID
```
