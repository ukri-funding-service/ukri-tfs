import { Logger, NoopLogger } from '@ukri-tfs/logging';
import { CorrelationIds } from '../correlationIds/correlationIds';
import { Builder, generateStandardHeaders } from './headers';

const stubCorrelationIds: CorrelationIds = {
    root: 'root',
    parent: 'parent',
    current: 'current',
};

const stubLogger = new NoopLogger();

describe('packages/lambda-handler tfsServiceClient/headers', () => {
    describe('generateStandardHeaders', () => {
        it('should generate headers when no authorization is provided', () => {
            expect(generateStandardHeaders(stubCorrelationIds, undefined, stubLogger)).toMatchObject({
                'x-tfsuserid': 'anon',
                'x-rootcorrelationid': 'root',
                'x-correlationid': 'current',
            });
        });

        it('should log a warning that authorization is omitted when no authorization is provided', () => {
            const logs = new Array<string>();

            const mockLogger: Logger = {
                audit: function (...args: unknown[]): void {
                    logs.push(`audit: ${args.join(' ')}`);
                },
                debug: function (...args: unknown[]): void {
                    logs.push(`debug: ${args.join(' ')}`);
                },
                info: function (...args: unknown[]): void {
                    logs.push(`info: ${args.join(' ')}`);
                },
                warn: function (...args: unknown[]): void {
                    logs.push(`warn: ${args.join(' ')}`);
                },
                error: function (...args: unknown[]): void {
                    logs.push(`error: ${args.join(' ')}`);
                },
            };

            generateStandardHeaders(stubCorrelationIds, undefined, mockLogger);

            expect(logs).toHaveLength(1);
            expect(logs[0]).toMatch(/debug: .+NO AUTHORIZATION.*/);
        });

        it('should not add an Authorization header when no authorization is provided', () => {
            expect(generateStandardHeaders(stubCorrelationIds, undefined, stubLogger).Authorization).not.toBeDefined;
        });

        it('should generate headers with an "Authorization: Bearer token" when authorization is provided', () => {
            expect(
                generateStandardHeaders(stubCorrelationIds, 'Bearer stub-token-for-testing', stubLogger),
            ).toMatchObject({
                'x-tfsuserid': 'anon',
                'x-rootcorrelationid': 'root',
                'x-correlationid': 'current',
                Authorization: 'Bearer stub-token-for-testing',
            });
        });
    });

    describe('Builder', () => {
        describe('with minimal required parameters', () => {
            const uut = new Builder(stubLogger).withCorrelationIds(stubCorrelationIds);

            it('should build', () => {
                expect(uut.build()).toBeDefined();
            });

            it('should add x-tfsuserid header', () => {
                expect(uut.build()['x-tfsuserid']).toBeDefined();
            });

            it('should add anon as value of x-tfsuserid header', () => {
                expect(uut.build()['x-tfsuserid']).toEqual('anon');
            });

            it('should add x-correlationid header', () => {
                expect(uut.build()['x-correlationid']).toBeDefined();
            });

            it('should add given value to x-correlationid header', () => {
                expect(uut.build()['x-correlationid']).toEqual('current');
            });

            it('should add x-rootcorrelationid header', () => {
                expect(uut.build()['x-rootcorrelationid']).toBeDefined();
            });

            it('should add given value to x-rootcorrelationid header', () => {
                expect(uut.build()['x-rootcorrelationid']).toEqual('root');
            });
        });

        describe('without required parameters', () => {
            it('should throw', () => {
                const uut = new Builder(stubLogger); // Missing correlation ids

                expect(() => uut.build()).toThrow();
            });
        });

        describe('with optional authorization', () => {
            const uut = new Builder(stubLogger)
                .withCorrelationIds(stubCorrelationIds)
                .withAuthorization('Bearer test-access-token');

            it('should build', () => {
                expect(uut.build()).toBeDefined();
            });

            it('should add x-tfsuserid header', () => {
                expect(uut.build()['x-tfsuserid']).toBeDefined();
            });

            it('should add anon as value of x-tfsuserid header', () => {
                expect(uut.build()['x-tfsuserid']).toEqual('anon');
            });

            it('should add x-correlationid header', () => {
                expect(uut.build()['x-correlationid']).toBeDefined();
            });

            it('should add given value to x-correlationid header', () => {
                expect(uut.build()['x-correlationid']).toEqual('current');
            });

            it('should add x-rootcorrelationid header', () => {
                expect(uut.build()['x-rootcorrelationid']).toBeDefined();
            });

            it('should add given value to x-rootcorrelationid header', () => {
                expect(uut.build()['x-rootcorrelationid']).toEqual('root');
            });

            it('should add Authorization', () => {
                expect(uut.build().Authorization).toEqual(`Bearer test-access-token`);
            });

            it('should omit empty authorization stanza', () => {
                const logs = new Array<string>();

                const mockLogger: Logger = {
                    audit: function (...args: unknown[]): void {
                        logs.push(`audit: ${args.join(' ')}`);
                    },
                    debug: function (...args: unknown[]): void {
                        logs.push(`debug: ${args.join(' ')}`);
                    },
                    info: function (...args: unknown[]): void {
                        logs.push(`info: ${args.join(' ')}`);
                    },
                    warn: function (...args: unknown[]): void {
                        logs.push(`warn: ${args.join(' ')}`);
                    },
                    error: function (...args: unknown[]): void {
                        logs.push(`error: ${args.join(' ')}`);
                    },
                };

                new Builder(mockLogger).withCorrelationIds(stubCorrelationIds).withAuthorization('').build();

                expect(logs).toContain('debug: Authorization was zero-length, Authentication header will be omitted');
            });
        });
    });
});
