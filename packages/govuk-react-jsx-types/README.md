# GovUK React JSX types

This module contains type definition for the [govuk-react-jsx](https://www.npmjs.com/package/govuk-react-jsx) module.

It provides types only, to allow Typescript code to utilise the JSX
components from govuk-react-jsx which provides no types.

## Setup within a module

To use these types in your module:

-   add this module as a devDependency

```
  "devDependencies": {
    ...
    "@ukri-tfs/govuk-react-jsx-types": "*",
    ...
  }
```

-   add an entry to the "typeRoots" configuration in your tsconfig to
    references this module using a relative path

```
    "compilerOptions": {
        ...
        "typeRoots": [
            "./@types",
            "./node_modules/@types",
            "./node_modules/@ukri-tfs/govuk-react-jsx-types"
        ],
        ...
    }
```

_Note: Be careful to include "./node_modules/@types" to avoid losing existing global type definitions._
