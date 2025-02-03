# ui-components (with wrapper)

This directory is a wrapper around the ui-components to provide react to the
build process of ui-components without leaking react to service.

See the following issues for background:

-   FSB-3559
-   <https://github.com/vercel/next.js/issues/9022>
-   <https://github.com/pnpm/pnpm/issues/2743>
-   <https://github.com/facebook/react/issues/13991>

When the underlying issue is resolved this wrapper layer can be removed and the
ui-components package moved back up a directory.

Essentially:

-   if next.js finds a link to react in a dependency then it picks up that react
    as duplicate.
-   with config.resolve.alias["react"] = require.resolve("react"); in
    .next.config.js doesn't seem to fix it (as one might expect)
-   dependency needs react as a devDependency to run unit tests and storybook.

By wrapping ui-components in a wrapper package ui-components picks up react for
unit tests and storybook, however the react app doesn't find them so sticks to
the single local react in its `node_module` that it knows and loves.
