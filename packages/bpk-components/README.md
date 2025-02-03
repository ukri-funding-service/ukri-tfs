# Backpack component webpack

This library provides a build artefact and css output for backpack components. Currently building the BpkCalendar and BpkPopover components.

## Modifying the library

To add another component to the library to the build output, follow these steps:

1. Install the package as a development dependency

```
npm i -d bpk-datepicker
```

2. Add the package (and any other bpk dependencies) to the webpack config (webpack.config.js)

3. Run webpack

```
npm run webpack
```

## Publishing changes to library

This library is published to the UKRI Nexus NPM registry, where it can be used from all projects that require it.

To publish changes to this library:

1. Login to Nexus NPM registry, providing details, as requested (this adds an entry to your `~/.npmrc` file)

```
npm login --registry=https://devops.innovateuk.org/binaries/repository/npm-private/
```

2. Publish the package to Nexus:

```
npm publish
```

n.b If you receive the following error, then make sure you have incremented the package version before publishing:

> npm ERR! 400 Bad Request - PUT https://devops.innovateuk.org/binaries/repository/npm-private/bpk-components - Repository does not allow updating assets: npm-private
