import { getHtmlCleanMiddleware } from '@ukri-tfs/html-utils';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { FastifyRequest } from 'fastify';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

describe('packages/fastify-server-startup - middleware', () => {
    before('setup', () => {
        chai.use(chaiAsPromised);
        chai.use(sinonChai);
    });

    describe('htmlClean - HTML clean middleware', () => {
        it('should clean a string passed in the req.body', () => {
            // given
            const req = {
                body: '<p>someString</p>',
            } as FastifyRequest;
            const res = undefined;
            const nextStub = sinon.stub();
            const fieldsToLeaveUnSanitized = [];
            const richTextEditorFields = [];

            // when
            const middleware = getHtmlCleanMiddleware({ fieldsToLeaveUnSanitized, richTextEditorFields });
            middleware(req, res, nextStub);

            // then
            expect(req.body).to.eql('');
            expect(nextStub).to.be.calledOnce;
        });

        it('should clean a list of strings passed in the req.body', () => {
            // given
            const req = {
                body: ['<p>someString</p>', "foo<script>eval('bad')</script>bar"],
            } as FastifyRequest;
            const res = undefined;
            const nextStub = sinon.stub();
            const fieldsToLeaveUnSanitized = [];
            const richTextEditorFields = [];

            // when
            const middleware = getHtmlCleanMiddleware({ fieldsToLeaveUnSanitized, richTextEditorFields });
            middleware(req, res, nextStub);

            // then
            expect(req.body).to.deep.equal(['', 'foobar']);
            expect(nextStub).to.be.calledOnce;
        });

        it('should clean an object containing string values passed in the req.body', () => {
            // given
            const req = {
                body: {
                    firstname: '<p>foo</p>',
                    lastname: "<a href='https://www.jetbrains.com/webstorm/'>incredible</a>bar",
                },
            } as FastifyRequest;
            const res = undefined;
            const nextStub = sinon.stub();
            const fieldsToLeaveUnSanitized = [];
            const richTextEditorFields = [];

            // when
            const middleware = getHtmlCleanMiddleware({ fieldsToLeaveUnSanitized, richTextEditorFields });
            middleware(req, res, nextStub);

            // then
            expect(req.body).to.deep.equal({ firstname: '', lastname: 'bar' });
            expect(nextStub).to.be.calledOnce;
        });

        it('should not change the req.body definition when there is no body is present on the request object', () => {
            // given
            const req = {
                body: undefined,
            } as FastifyRequest;
            const res = undefined;
            const nextStub = sinon.stub();
            const fieldsToLeaveUnSanitized = [];
            const richTextEditorFields = [];

            // when
            const middleware = getHtmlCleanMiddleware({ fieldsToLeaveUnSanitized, richTextEditorFields });
            middleware(req, res, nextStub);

            // then
            expect(req.body).to.be.undefined;
            expect(nextStub).to.be.calledOnce;
        });

        it('should clean an object passed the req.body including a rich text field', () => {
            // given
            const req = {
                body: {
                    test: '<p>Test text</p>',
                    questionGuidance: '<p>This is <strong>valid</strong> HTML. This <script></script> is not.</p>',
                },
            } as FastifyRequest;
            const res = undefined;
            const nextStub = sinon.stub();
            const fieldsToLeaveUnSanitized = [];
            const richTextEditorFields = ['questionGuidance'];

            // when
            const middleware = getHtmlCleanMiddleware({ fieldsToLeaveUnSanitized, richTextEditorFields });
            middleware(req, res, nextStub);

            // then
            expect(req.body).to.deep.equal({
                test: '',
                questionGuidance: '<p>This is <strong>valid</strong> HTML. This  is not.</p>',
            });
            expect(nextStub).to.be.calledOnce;
        });
    });
});
