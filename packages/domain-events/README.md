# Domain Event Schemas

This package contains the JSON Schema definitions for the Domain Events which may be
dispatched from within the TFS domains.

# Generating human-readable docs

A collated set of events schemas and schema files, along with a zip file of the same,
can be generated with the following command:

```
> npm run docs
```

On completion, a directory will be created called 'docs' which contains schemas and
markdown. There will also be a 'schema.zip' file containing this information.

# Procedure to generate the schemas on new TFS release

Each time a release is published, the event schemas need to be published as well.
This allows consumers of any new Domain Events to view the event contracts.

There is a repo containing the schema data at https://bitbucket.org/ukri-ddat/ukri-tfs-schemas/

The manual process to update the schemas is as follows:

-   `git fetch --tags`
-   Checkout the correct tag: `git checkout 1.145`
-   cd into this folder (packages/domain-events)
-   check you have unzip installed (unzip --help)
    -   note this should work with macos unzip and gunzip however is untested on macos
-   run `./release.sh 1.145` replacing the release number with your release
