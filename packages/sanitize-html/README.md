# Sanitize Html

This library provides a modified version of `sanitize-html` at version 1.27.2.
>https://github.com/apostrophecms/sanitize-html

## Reason for this repository
The original `sanitize-html` library would escape strings in places where we did not anticipate stings to be escaped.

```javascript
console.log(sanitizeHtml("foo & bar"));
// result: foo &amp; bar
```

Alternative methods at modifying this behviour proved unsuccessful.

## Changes

1. The `escapeHtml` function has been modified to simply return the first argument that it is called with.

2. The default for the underlying `parseHtml2` librar `htmlParserDefaults.decodeEntities` was previously set to `true`, but it has been changed to be `false`.

3. The tests that expected escaped HTML have been removed.

4. Additional tests have been added to verify the new behaviour is what we expect.

## Modifying the library
To make changes to this library, you will need to create a PR. This repo does not have a build process, nor does it require building as it does not utilise webpack.

> Note: Attempts were made to use webpack however this was problematic and further attempts to troubleshoot were impractical at the time. When importing `sanitizeHtml` from `@ukri-tfs/sanitize-html`, typescript environments could not determine the location of the function.

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
