Ÿ# Logging levels

## debug

More granular than you will need when viewing the logs to understand what has happened in the system. Should contain information that may be needed for diagnosing issues and troubleshooting or when running application in the test environment for the purpose of making sure everything is running correctly.

This is the preferred level to use to aid development.
If using, ensure debug level logging is enabled in your local environment.

Will not show up by default in production logging.

## audit

There is a non functional requirement that at the boundaries of the system a user's actions are recorded in audit level logging.

This should be implemented in middleware, so developers shouldn't generally expect to add any audit log during normal feature development.

Will show up by default in production logging.

## info

The informational log level indicating that something happened, the application entered a certain state, etc. For example, a handler may include an info log with the type of request and a relevant requested id or count of requested ids.

Use more sparingly than a debug log. e.g. do not include an info log inside a loop.
Valid examples include start up logs.

Will show up by default in production logging.

## warn

Something unusual or unexpected happened, but the system can continue the work.

Will show up by default in production logging.

## error

Log an error when a request could not be completed due to an unexpected situation. An error log indicates a part of the system is not properly functioning.

See general section on including error object in a log.

Will show up by default in production logging.

## General

All personal information (email addresses, names, passwords, tokens etc) should be redacted from any debug information.
Content which a system handles on behalf of a user, but which is not used in the execution of the system (for instance application content), must be treated as personal information

Include relevant ids or counts, e.g. "Getting <list.length> applications from AM API", "Getting application <review.id> from ERM API"

Reasonably verbose logging should be implemented to ensure that log entries contain enough information to support engineers troubleshooting issues whilst the application is running, without having to investigate the code to understand processing flows or domain logic.

On background tasks (E.g. scheduled tasks, Lambda processes), additional logging is required to indicate processes starting, their success status and any error codes.

Calls to any third-party services, including internal services such as REST APIs or data tiers should include debug/info entries so that failure points can be identified.
Such calls should include URL, HTTP status, HTTP method, size of payload and duration of call.

Including an object in the text of a log can result in [object Object], instead use JSON.stringify(error, Object.getOwnPropertyNames(error)).
