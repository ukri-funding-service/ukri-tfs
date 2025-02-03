# Circuit-Breaker

This module is a simple implementation of the [circuit-breaker pattern](https://martinfowler.com/bliki/CircuitBreaker.html?ref=wellarchitected)

This pattern helps to isolate a client from failure or overload of a dependency, and to manage load on that dependency. Once a dependency has been overloaded or down for consecutive requests, further requests through the circuit-breaker for a backoff period will be immediately rejected. At the end of the backoff period, the dependency will be retried once - if it is still unresponsive a new backoff period starts. This allows time for the dependency to recover and the client to take appropriate fallback action immediately.

A typical use for this pattern is in microservices architecture, where services communicate over synchronous HTTP. When a service is receiving too many requests it may become unresponsive. Further requests arriving during this period just make matters worse, and the client will typically have to wait for a long timeout period between failures. Introducing a circuit-breaker around the client request means that the client can avoid wasted time determining that the dependency is unavailable, and by backing off it increases the likelihood that the dependency can recover effectively.

# Appropriate usage

The Circuit-Breaker is stateful. This has implications for when and how it is used.

-   It needs to persist across interactions with its dependency
-   It won't work well in an environment where program lifecycle is externally controlled and may be abruptly terminated and restarted (eg serverless functions)
-   There should be one circuit-breaker around each separate dependency. In our system, that typically means one service. A circuit breaker should NOT be shared between different dependencies.

## Example

```
// Builder function. This should be called once only, at startup, before the first use of the dependency
const buildCircuitBreaker = (logger: Logger) => CircuitBreaker = {
    // Define the maximum permitted failures of the managed function before it is considered
    // unresponsive
    const maxRetriesBeforeTrip = 3;

    // Define the cooldown period before it is permitted to retry the managed function again
    // following failure
    const cooldownPeriodInSeconds = 10;

    return new CircuitBreaker(maxRetriesBeforeTrip, cooldownPeriodInSeconds, logger);
}

{
    // ... in other code ...

    // Create a managed function which does some work using the dependency.
    const httpRequest: ManagedRequest<ResponseType> = {...}

    try {
        // Execute the request using the circuit-breaker.
        const response = await circuitBreaker.executeRequest(httpRequest);

        // If the code gets here the managed function has successfully completed
        // ... do something with the response

    } catch (err) {

        if(err instanceof CircuitOpenError) {

            // We are in a 'circuit-open' state with the dependency unresponsive
            //
            // Typically, a HTTP client should either return a 502 or 504 status code,
            // or an appropriate cached or fallback response

        } else {

            // The request failed, but the circuit is not yet open.
            //
            // The client may wish to retry.

        }
    }
}
```
