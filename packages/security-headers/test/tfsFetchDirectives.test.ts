import { describe, expect, it } from '@jest/globals';
import {
    getConnectSrcDirective,
    getDefaultSrcDirective,
    getFontSrcDirective,
    getFrameSrcDirective,
    getImgSrcDirective,
    getScriptSrcDirective,
    getSourceFilter,
    getStyleSrcDirective,
    isSourcePermittedInDevelopment,
    isSourcePermittedInProduction,
} from '../src/tfsFetchDirectives';

describe('packages/security-headers - response/tfsFetchDirectives', () => {
    describe('default-src directive', () => {
        describe('behaviour in DEVELOPMENT', () => {
            it('should return a default-src directive', () => {
                expect(getDefaultSrcDirective('DEVELOPMENT').name).toEqual('default-src');
            });

            it('should return a default-src directive with element self', () => {
                expect(getDefaultSrcDirective('DEVELOPMENT').orderedClauses).toContain("'self'");
            });
        });

        describe('behaviour in PRODUCTION', () => {
            it('should return a default-src directive', () => {
                expect(getDefaultSrcDirective('PRODUCTION').name).toEqual('default-src');
            });

            it('should return a default-src directive with element self', () => {
                expect(getDefaultSrcDirective('PRODUCTION').orderedClauses).toContain("'self'");
            });
        });
    });

    describe('script-src directive', () => {
        describe('behaviour in DEVELOPMENT', () => {
            it('should return a script-src directive', () => {
                expect(getScriptSrcDirective('DEVELOPMENT').name).toEqual('script-src');
            });

            it('should return an clause containing self', () => {
                expect(getScriptSrcDirective('DEVELOPMENT').orderedClauses).toContain("'self'");
            });

            it('should return an element containing unsafe-eval', () => {
                expect(getScriptSrcDirective('DEVELOPMENT').orderedClauses).toContain("'unsafe-eval'");
            });

            it('should return an element containing unsafe-inline', () => {
                expect(getScriptSrcDirective('DEVELOPMENT').orderedClauses).toContain("'unsafe-inline'");
            });

            it('should contain google tag manager clauses', () => {
                expect(getScriptSrcDirective('DEVELOPMENT').orderedClauses).toContain('*.googletagmanager.com');
            });

            it('should contain google analytics clauses', () => {
                expect(getScriptSrcDirective('DEVELOPMENT').orderedClauses).toContain('*.google-analytics.com');
            });

            it('should contain new relic clauses', () => {
                expect(getScriptSrcDirective('PRODUCTION').orderedClauses).toContain('*.newrelic.com');
                expect(getScriptSrcDirective('PRODUCTION').orderedClauses).toContain('*.nr-data.net');
            });
        });

        describe('behaviour in PRODUCTION', () => {
            it('should return a script-src directive', () => {
                expect(getScriptSrcDirective('PRODUCTION').name).toEqual('script-src');
            });

            it('should return a clause containing self', () => {
                expect(getScriptSrcDirective('PRODUCTION').orderedClauses).toContain("'self'");
            });

            it('should NOT return an clause containing unsafe-eval', () => {
                expect(getScriptSrcDirective('PRODUCTION').orderedClauses).not.toContain("'unsafe-eval'");
            });

            it('should return an element containing unsafe-inline', () => {
                expect(getScriptSrcDirective('PRODUCTION').orderedClauses).toContain("'unsafe-inline'");
            });

            it('should contain google clauses', () => {
                expect(getScriptSrcDirective('PRODUCTION').orderedClauses).toContain('*.googletagmanager.com');
                expect(getScriptSrcDirective('PRODUCTION').orderedClauses).toContain('*.google-analytics.com');
            });

            it('should contain hotjar clauses', () => {
                expect(getScriptSrcDirective('PRODUCTION').orderedClauses).toContain('https://static.hotjar.com');
                expect(getScriptSrcDirective('PRODUCTION').orderedClauses).toContain('https://script.hotjar.com');
            });

            it('should contain new relic clauses', () => {
                expect(getScriptSrcDirective('PRODUCTION').orderedClauses).toContain('*.newrelic.com');
                expect(getScriptSrcDirective('PRODUCTION').orderedClauses).toContain('*.nr-data.net');
            });
        });
    });

    describe('img-src directive', () => {
        describe('behaviour in DEVELOPMENT', () => {
            it('should return a default-src directive', () => {
                expect(getImgSrcDirective('DEVELOPMENT').name).toEqual('img-src');
            });

            it('should contain self', () => {
                expect(getImgSrcDirective('DEVELOPMENT').orderedClauses).toContain("'self'");
            });

            it('should contain static images', () => {
                expect(getImgSrcDirective('DEVELOPMENT').orderedClauses).toContain(
                    'ukri-tfs-prod-assets.s3.eu-west-2.amazonaws.com',
                );
            });

            it('should contain data:', () => {
                expect(getImgSrcDirective('DEVELOPMENT').orderedClauses).toContain('data:');
            });

            it('should contain google clauses', () => {
                expect(getImgSrcDirective('DEVELOPMENT').orderedClauses).toContain('*.googletagmanager.com');
                expect(getImgSrcDirective('DEVELOPMENT').orderedClauses).toContain('*.google-analytics.com');
            });

            it('should contain hotjar clauses', () => {
                expect(getImgSrcDirective('DEVELOPMENT').orderedClauses).toContain('https://script.hotjar.com');
            });
        });

        describe('behaviour in PRODUCTION', () => {
            it('should return a default-src directive', () => {
                expect(getImgSrcDirective('PRODUCTION').name).toEqual('img-src');
            });

            it('should contain self', () => {
                expect(getImgSrcDirective('PRODUCTION').orderedClauses).toContain("'self'");
            });

            it('should contain static images', () => {
                expect(getImgSrcDirective('PRODUCTION').orderedClauses).toContain(
                    'ukri-tfs-prod-assets.s3.eu-west-2.amazonaws.com',
                );
            });

            it('should contain data:', () => {
                expect(getImgSrcDirective('PRODUCTION').orderedClauses).toContain('data:');
            });

            it('should contain google clauses', () => {
                expect(getImgSrcDirective('PRODUCTION').orderedClauses).toContain('*.googletagmanager.com');
                expect(getImgSrcDirective('PRODUCTION').orderedClauses).toContain('*.google-analytics.com');
            });

            it('should contain hotjar clauses', () => {
                expect(getImgSrcDirective('PRODUCTION').orderedClauses).toContain('https://script.hotjar.com');
            });
        });
    });

    describe('style-src directive', () => {
        describe('behaviour in DEVELOPMENT', () => {
            it('should return a style-src directive', () => {
                expect(getStyleSrcDirective('DEVELOPMENT').name).toEqual('style-src');
            });

            it('should contain self', () => {
                expect(getStyleSrcDirective('DEVELOPMENT').orderedClauses).toContain("'self'");
            });

            it('should contain unsafe-inline', () => {
                expect(getStyleSrcDirective('DEVELOPMENT').orderedClauses).toContain("'unsafe-inline'");
            });
        });

        describe('behaviour in PRODUCTION', () => {
            it('should return a style-src directive', () => {
                expect(getStyleSrcDirective('PRODUCTION').name).toEqual('style-src');
            });

            it('should contain self', () => {
                expect(getStyleSrcDirective('PRODUCTION').orderedClauses).toContain("'self'");
            });

            it('should contain unsafe-inline', () => {
                expect(getStyleSrcDirective('PRODUCTION').orderedClauses).toContain("'unsafe-inline'");
            });
        });
    });

    describe('font-src directive', () => {
        describe('behaviour in DEVELOPMENT', () => {
            it('should return a font-src directive', () => {
                expect(getFontSrcDirective('DEVELOPMENT').name).toEqual('font-src');
            });

            it('should contain self', () => {
                expect(getFontSrcDirective('DEVELOPMENT').orderedClauses).toContain("'self'");
            });

            it('should contain google fonts', () => {
                expect(getFontSrcDirective('DEVELOPMENT').orderedClauses).toContain('fonts.gstatic.com');
            });

            it('should contain hotjar fonts', () => {
                expect(getFontSrcDirective('DEVELOPMENT').orderedClauses).toContain('https://script.hotjar.com');
            });
        });

        describe('behaviour in PRODUCTION', () => {
            it('should return a font-src directive', () => {
                expect(getFontSrcDirective('PRODUCTION').name).toEqual('font-src');
            });

            it('should contain self', () => {
                expect(getFontSrcDirective('PRODUCTION').orderedClauses).toContain("'self'");
            });

            it('should contain google fonts', () => {
                expect(getFontSrcDirective('PRODUCTION').orderedClauses).toContain('fonts.gstatic.com');
            });

            it('should contain hotjar fonts', () => {
                expect(getFontSrcDirective('PRODUCTION').orderedClauses).toContain('https://script.hotjar.com');
            });
        });
    });

    describe('connect-src directive', () => {
        describe('behaviour in DEVELOPMENT', () => {
            it('should return a connect-src directive', () => {
                expect(getConnectSrcDirective('DEVELOPMENT').name).toEqual('connect-src');
            });

            it('should contain self', () => {
                expect(getConnectSrcDirective('DEVELOPMENT').orderedClauses).toContain("'self'");
            });

            it('should contain google analytics', () => {
                expect(getConnectSrcDirective('DEVELOPMENT').orderedClauses).toContain('*.google-analytics.com');
            });

            it('should contain hotjar', () => {
                expect(getConnectSrcDirective('DEVELOPMENT').orderedClauses).toContain('https://*.hotjar.com:*');
                expect(getConnectSrcDirective('DEVELOPMENT').orderedClauses).toContain('https://vc.hotjar.io:*');
                expect(getConnectSrcDirective('DEVELOPMENT').orderedClauses).toContain('https://surveystats.hotjar.io');
                expect(getConnectSrcDirective('DEVELOPMENT').orderedClauses).toContain('wss://*.hotjar.com');
            });

            it('should contain newrelic', () => {
                expect(getConnectSrcDirective('DEVELOPMENT').orderedClauses).toContain('https://bam.nr-data.net');
            });
        });

        describe('behaviour in PRODUCTION', () => {
            it('should return a connect-src directive', () => {
                expect(getConnectSrcDirective('PRODUCTION').name).toEqual('connect-src');
            });

            it('should contain self', () => {
                expect(getConnectSrcDirective('PRODUCTION').orderedClauses).toContain("'self'");
            });

            it('should contain google analytics', () => {
                expect(getConnectSrcDirective('PRODUCTION').orderedClauses).toContain('*.google-analytics.com');
            });

            it('should contain hotjar', () => {
                expect(getConnectSrcDirective('PRODUCTION').orderedClauses).toContain('https://*.hotjar.com:*');
                expect(getConnectSrcDirective('PRODUCTION').orderedClauses).toContain('https://vc.hotjar.io:*');
                expect(getConnectSrcDirective('PRODUCTION').orderedClauses).toContain('https://surveystats.hotjar.io');
                expect(getConnectSrcDirective('PRODUCTION').orderedClauses).toContain('wss://*.hotjar.com');
            });

            it('should contain newrelic', () => {
                expect(getConnectSrcDirective('PRODUCTION').orderedClauses).toContain('https://bam.nr-data.net');
            });
        });
    });

    describe('frame-src directive', () => {
        describe('behaviour in DEVELOPMENT', () => {
            it('should return a frame-src directive', () => {
                expect(getFrameSrcDirective('DEVELOPMENT').name).toEqual('frame-src');
            });

            it('should contain hotjar', () => {
                expect(getFrameSrcDirective('DEVELOPMENT').orderedClauses).toContain('https://vars.hotjar.com');
            });
        });

        describe('behaviour in PRODUCTION', () => {
            it('should return a frame-src directive', () => {
                expect(getFrameSrcDirective('PRODUCTION').name).toEqual('frame-src');
            });

            it('should contain hotjar', () => {
                expect(getFrameSrcDirective('PRODUCTION').orderedClauses).toContain('https://vars.hotjar.com');
            });
        });
    });

    describe('isSourcePermittedInDevelopment', () => {
        it('should allow unsafe-eval in DEVELOPMENT', () => {
            expect(isSourcePermittedInDevelopment("'unsafe-eval'")).toBeTruthy();
        });

        it('should allow a valid source in DEVELOPMENT', () => {
            expect(isSourcePermittedInDevelopment('https://www.ukri.org')).toBeTruthy();
        });
    });

    describe('isSourcePermittedInProduction', () => {
        it('should not allow unsafe-eval in PRODUCTION', () => {
            expect(isSourcePermittedInProduction("'unsafe-eval'")).toBeFalsy();
        });

        it('should allow a valid source in PRODUCTION', () => {
            expect(isSourcePermittedInDevelopment('https://www.ukri.org')).toBeTruthy();
        });
    });

    describe('getSourceFilter', () => {
        it('should return expected filter in PRODUCTION', () => {
            expect(getSourceFilter('PRODUCTION')).toEqual(isSourcePermittedInProduction);
        });

        it('should return expected filter in DEVELOPMENT', () => {
            expect(getSourceFilter('DEVELOPMENT')).toEqual(isSourcePermittedInDevelopment);
        });
    });
});
