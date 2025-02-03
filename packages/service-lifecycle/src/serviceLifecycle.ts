/**
 * Lifecycle stages of a Service.
 *
 * Responsibilities:
 * - configure: acquire and build any configuration
 * - bootstrap: create the runtime service
 * - startup:   execute the runtime service
 * - shutdown:  terminate the service, releasing any resources
 */
export interface ServiceLifecycle {
    /**
     * Initialise the runtime configuration for use by other lifecycle stages.
     * This might include reading from the runtime process environment,
     * configuration files, external configuration servers, etc.
     * Missing or invalid configuration should result in an error.
     */
    configure: () => Promise<void>;

    /**
     * Construct the service ready for execution.
     * Instantiate all runtime components.
     */
    bootstrap: () => Promise<void>;

    /**
     * Execute the service.
     */
    startup: () => Promise<void>;

    /**
     * Terminate the service.
     * Free resources held by the service.
     * It should be expected that shutdown may be called multiple times.
     */
    shutdown: () => Promise<void>;
}
