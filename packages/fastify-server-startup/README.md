# Fastify server startup common library

A shared library for instantiating our APIs using fastify

## Overview

A common package that exports two methods:

-   `createFastifyRestServer`
    Primary function that returns a `FastifyInstance` object that is not listening on any port

-   `start`
    Takes a `FastifyInstance` object as an argument and starts listening on it.

## Usage

```
const fastifyServer = createFastifyRestServer(context, httpsServerFactory);

start(fastifyServer);
```

## Configuration

```
interface ServerConfig {
    name: string;
    shortName: string;
    requireServerAuthentication: boolean;
    services: { [key: string]: object | undefined };
    endpoints: Endpoint[];
    port: number;
    requiredClaimsString: string;
    logger?: Logger;
    getUserFunction: GetUserFunction;
    isValidJwtOptions?: VerifyJwtMiddlewareOptions;
    htmlCleanOptions?: HtmlCleanMiddlewareOptions;
    fastifyOptions?: object;
    serveApiDocumentation: boolean;
}
```
