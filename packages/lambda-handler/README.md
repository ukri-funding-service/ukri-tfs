# Lambda Handler

## What is this

This package provides functionality to:

-   Get records from a given SQS event, so a provided function can handle an individual record.
-   Return a structure that conforms to the SQSBatchResponse structure, so that AWS will implement the appropriate strategy for retries.
-   tfsFetch - a function like fetch that will add the required headers for authentication when calling TFS REST serices.
-   A function for logging (which will include the correlation ids in the logged message)

## How is it used?

See application-manager/lambdas for an example. You need to depend on this package, and then call handleSqsEvent passing in:

-   A function for processing a record from the event - this function will be given the record and the tfsFetch function.
-   The event.
-   Credentials/keys/certs information (which will be used to get a token for authentication).
