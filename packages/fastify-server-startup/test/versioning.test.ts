import { anonymousUser } from '@ukri-tfs/auth';
import chai, { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { createTestServer } from './helpers/testServer';

describe('packages/fastify-server-startup - versioning', () => {
    before(() => {
        chai.use(sinonChai);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('server version handling responses', () => {
        it('should return 2.3 when 2.x is requested and 1.2, 2.3 are available', async () => {
            const server = await createTestServer({
                endpoints: [
                    {
                        path: '/test',
                        endpoints: async app => {
                            app.get('/', { constraints: { version: '1.2.0' } }, (req, reply) => {
                                reply.code(200).send({ message: 'hello from 1.2.0' });
                            });

                            app.get('/', { constraints: { version: '2.3.0' } }, (req, reply) => {
                                reply.code(200).send({ message: 'hello from 2.3.0' });
                            });
                        },
                    },
                ],
            });

            const response = await server.inject({
                method: 'GET',
                url: 'http://127.0.0.1/test',
                headers: { 'x-tfsuserid': anonymousUser, 'accept-version': '2.x' },
            });

            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body)).to.deep.equal({ message: 'hello from 2.3.0' });
        });

        it('should return 1.2 when 2.x is requested and 1.2, 3.4 are available', async () => {
            const server = await createTestServer({
                endpoints: [
                    {
                        path: '/test',
                        endpoints: async app => {
                            app.get('/', { constraints: { version: '1.2.0' } }, (req, reply) => {
                                reply.code(200).send({ message: 'hello from 1.2.0' });
                            });

                            app.get('/', { constraints: { version: '3.4.0' } }, (req, reply) => {
                                reply.code(200).send({ message: 'hello from 3.4.0' });
                            });
                        },
                    },
                ],
            });

            const response = await server.inject({
                method: 'GET',
                url: 'http://127.0.0.1/test',
                headers: { 'x-tfsuserid': anonymousUser, 'accept-version': '2.x' },
            });

            expect(response.statusCode).to.equal(404);
        });

        it('should return 404 status when 2.x is requested and 3.4, 4.5 are available', async () => {
            const server = await createTestServer({
                endpoints: [
                    {
                        path: '/test',
                        endpoints: async app => {
                            app.get('/', { constraints: { version: '3.4.0' } }, (req, reply) => {
                                reply.code(200).send({ message: 'hello from 3.4.0' });
                            });

                            app.get('/', { constraints: { version: '4.5.0' } }, (req, reply) => {
                                reply.code(200).send({ message: 'hello from 4.5.0' });
                            });
                        },
                    },
                ],
            });

            const response = await server.inject({
                method: 'GET',
                url: 'http://127.0.0.1/test',
                headers: { 'x-tfsuserid': anonymousUser, 'accept-version': '2.x' },
            });

            expect(response.statusCode).to.equal(404);
        });

        it('should return 404 status when 2.1 is requested and 1.2, 3.4 are available', async () => {
            const server = await createTestServer({
                endpoints: [
                    {
                        path: '/test',
                        endpoints: async app => {
                            app.get('/', { constraints: { version: '1.2.0' } }, (req, reply) => {
                                reply.code(200).send({ message: 'hello from 1.2.0' });
                            });

                            app.get('/', { constraints: { version: '3.4.0' } }, (req, reply) => {
                                reply.code(200).send({ message: 'hello from 3.4.0' });
                            });
                        },
                    },
                ],
            });

            const response = await server.inject({
                method: 'GET',
                url: 'http://127.0.0.1/test',
                headers: { 'x-tfsuserid': anonymousUser, 'accept-version': '2.1.x' },
            });

            expect(response.statusCode).to.equal(404);
        });

        it('should return 404 for a end-point when no version is given', async () => {
            const server = await createTestServer({
                endpoints: [
                    {
                        path: '/test',
                        endpoints: app =>
                            app.get('/', { constraints: { version: '1.0.0' } }, (req, reply) => {
                                reply.code(200).send({ message: 'hello from 1.0.0' });
                            }),
                    },
                ],
            });

            const response = await server.inject({
                method: 'GET',
                url: 'http://127.0.0.1/test',
                headers: { 'x-tfsuserid': anonymousUser },
            });

            expect(response.statusCode).to.equal(404);
        });
    });
});
