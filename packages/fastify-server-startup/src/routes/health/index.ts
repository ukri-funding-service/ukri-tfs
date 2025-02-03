import { FastifyReply, FastifyRequest } from 'fastify';

const DB_TIMEOUT_DURATION_MS = 1000;
export type HealthCheck = keyof typeof healthChecks;

export type HealthCheckConfig = {
    validationMethod: HealthCheck;
    thingToValidate: () => Promise<unknown>;
};

export const healthCheck = async (req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
    return reply.code(200).send({ status: 'OK' });
};

export const validateTypeOrmConnectionWithTimeout = async (getTypeOrmConnection: Function): Promise<void> => {
    const timeout = new Promise<void>((_resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Timeout validating database connection'));
        }, DB_TIMEOUT_DURATION_MS);
    });

    return Promise.race([validateTypeOrmConnection(getTypeOrmConnection), timeout]);
};

export const validateTypeOrmConnection = async (getTypeOrmConnection: Function): Promise<void> => {
    const connection = await getTypeOrmConnection().catch(() => {
        throw new Error('Cannot connect to database');
    });
    await connection.query('SELECT 1').catch(() => {
        throw new Error('Bad connection: Cannot query database');
    });
};

export const doHealthCheck = async (
    _req: FastifyRequest,
    reply: FastifyReply,
    config: HealthCheckConfig[],
): Promise<void> => {
    try {
        const checks = config.map(checkConfig =>
            healthChecks[checkConfig.validationMethod](checkConfig.thingToValidate),
        );
        const executedChecks = await Promise.allSettled(checks);
        const errors: PromiseRejectedResult[] = executedChecks.filter(
            executedCheck => executedCheck.status === 'rejected',
        ) as PromiseRejectedResult[];
        if (errors.length === 0) {
            reply.status(200).send({
                status: 'OK',
            });
        } else {
            const errorReasons: string[] = errors.map(error => error.reason.message);
            console.error('Failed healthcheck:', errorReasons);
            reply.status(500).send({
                status: 'ERROR',
                messages: errorReasons,
            });
        }
    } catch (err) {
        console.error('Unexpected error caused healthcheck to fail:', err);
        reply.status(500).send({
            status: 'ERROR',
            messages: 'unexpected error without message',
        });
    }
};

export const healthChecks = {
    validateTypeOrmConnection,
    validateTypeOrmConnectionWithTimeout,
};
