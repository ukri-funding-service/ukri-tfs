# Feature Flags

A simple mechanism to access a set of Feature Flags, which indicate whether optional functionality is
enabled or disabled.

A Feature Flag has the following characteristics:

-   it is identified by name, which is a non-empty string
-   it has a value, which is either a boolean or is undefined

Feature Flags are grouped into FeatureFlagSets, which have the following characteristics:

-   multiple Feature Flags may be contained within the set
-   there may be at most 1 Feature Flag with a particular name within the set

A Feature Flag with a given name is 'enabled' within a given FeatureFlagSet if all of the following are true:

-   a member exist in that set with that name
-   the matching member's value = true (which also means that it is not undefined)

A Feature Flag with a given name is 'disabled' within a given FeatureFlagSet if all of the following are true:

-   a member exist in that set with that name
-   the matching member's value = false (which also means that it is not undefined)

# Flag Provider

A FlagProvider is a source of FeatureFlags, to abstract the generation process.

A single concrete implementation, FlagProviderProcessEnv, is provided, which extracts FeatureFlags from the
Node process.env property when it is constructed.

FlagProviderProcessEnv has the following characteristics:

-   uses the values defined in process.env
-   includes any variable which has a name with the prefix "FEATURE\_" eg "FEATURE_STRICT_ROLE_CHECKING_IS_ENABLED"
-   expects matching variables to have a string-encoded boolean value, ie 'true' or 'false'
