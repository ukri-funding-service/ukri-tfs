> ⚠️ **Note: award domain events are versioned per event not as a whole. This is different from other domain events. See versioning.**

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

Award domain events are versioned per event not as a whole.

A new cr-submitted event will only increase the version number for the cr-submitted event and not for the award domain events as a whole. This is different from other domain events. This was due to the large number of domain events that were in regular flux and the overhead for the increasing a version. The folder layout therefore is somewhat misleading.
the v1, v2, etc folders will hold the corresponding version of the event and therefore still be relevant until the point that there are no events being released still on those versions. Likewise the highest version folder will only contain the events that are at that highest version number and you would only need to add a new folder if one of those events needed updated.

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

When a breaking change is to be made to an event type, a new version of that event type schema must be created with an incremental increase in its version.
