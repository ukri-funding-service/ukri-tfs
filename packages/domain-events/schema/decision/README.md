# Event schema for Decision Service

This folder contains the schema describing events which are emitted by the Domain.

It forms a contract which consumers of events will depend upon, and which the code which generates the events must comply.

**Any code change which would result in a breaking change when validated against the schema should be discussed with the team BEFORE committing to trunk**

Examples of a breaking change would include, but are not limited to:

-   a change of property type
-   a change of property name
-   the removal of a property
-   the addition of a new mandatory property
-   a change to the schema to avoid a new validation error caused by a code change

## Versioning

### Directory name

Versioning is indicated by the directory name of the parent directory containing the schema files.

Consider the following example

```
    .../domain/port/event/schema/v1/thing.schema.json

```

This is in a directory **v1** so the schema version is **v1**. All schema files within a directory are at the same version.

### $id property

Each schema has an **$id** property, which is a URI-format identifier which is unique for that schema. This property contains the schema version as the last component of the URI path.

For instance, consider the schema:

```
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "https://funding-service.ukri.org/schema/thingservice/event/v1/thing.schema.json",
    "title": "Thing",
    ...
```

The **id** contains the path .../thingservice/event/**v1**/thing.schema.json so the schema version is **v1**.

When a breaking change is to be made to a schema, a new version of the schema must be created with an incremental increase in its version.
