import { ExtendedSchema, SwaggerJSONSchema } from '..';

export const healthCheckUrl = '/health';
export const versionUrl = '/version';

export const healthStatus: SwaggerJSONSchema = {
    type: 'string',
    enum: ['OK', 'ERROR'],
};

export const healthInfoMessage: SwaggerJSONSchema = {
    type: 'string',
    description: 'Only appears on error',
};

export const healthInfoMessageList: SwaggerJSONSchema = {
    type: 'array',
    items: healthInfoMessage,
};

export const healthcheck: SwaggerJSONSchema = {
    type: 'object',
    properties: {
        status: healthStatus,
        messages: healthInfoMessageList,
    },
    required: ['status'],
};

// No default headers required
export const healthCheckSchema: ExtendedSchema = {
    description: 'Check the health of the REST API service',
    response: {
        200: {
            description: 'A response containing the summary status for the service',
            ...healthcheck,
        },
        500: {
            description: 'Indicates the service cannot provide heathcheck information',
            ...healthcheck,
        },
    },
};
