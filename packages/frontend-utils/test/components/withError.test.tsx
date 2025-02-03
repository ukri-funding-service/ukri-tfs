/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mocha';
import React from 'react';
import { expect, should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { render } from '@testing-library/react';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { NextPage } from 'next';
import { NextPageContext } from 'next';
import { withError, WithErrorProps } from '../../src/components/withError';
import { HttpError, RedirectError } from '../../src/pageFunctions';
import sinon from 'sinon';

describe('withError tests', () => {
    should();
    use(chaiAsPromised);

    const WrappedComponent: NextPage = () => {
        return <p>Success</p>;
    };
    WrappedComponent.getInitialProps = async (ctx: NextPageContext): Promise<{}> => {
        if (ctx.err) {
            throw ctx.err;
        }
        return {};
    };
    const TestComponent = withError(WrappedComponent) as any;

    let request, response, ctx: NextPageContext;

    beforeEach(() => {
        request = new IncomingMessage(new Socket());
        response = new ServerResponse(request);
        ctx = { req: request, res: response } as NextPageContext;
    });

    afterEach(() => sinon.restore());

    it('should set the statusCode prop to 405 given a ServerResponse a 405 status code', async () => {
        ctx.res!.statusCode = 405;

        const props: Promise<WithErrorProps> = Promise.resolve(TestComponent.getInitialProps!(ctx));

        return expect(props).to.eventually.have.property('statusCode', 405);
    });

    it('should set the statusCode prop to 405 given an HttpError object with a 405 status code', async () => {
        ctx.err = new HttpError(405);

        const props: Promise<WithErrorProps> = Promise.resolve(TestComponent.getInitialProps!(ctx));

        return expect(props).to.eventually.have.property('statusCode', 405);
    });

    it('should set the response status code to 405 given an HttpError object with a 405 status code', async () => {
        ctx.err = new HttpError(405);

        await TestComponent.getInitialProps!(ctx);

        expect(ctx.res!.statusCode).to.eql(405);
    });

    it('should handle a redirect', async () => {
        ctx.err = new RedirectError('/', false);

        await TestComponent.getInitialProps!(ctx);

        expect(ctx.res!.statusCode).to.eql(302);
    });

    it('should handle a redirect and preserve data', async () => {
        ctx.err = new RedirectError('/', true);

        await TestComponent.getInitialProps!(ctx);

        expect(ctx.res!.statusCode).to.eql(307);
    });

    it('should set the response status message given an HttpError object with a status message', async () => {
        ctx.err = new HttpError(405, 'Method Not Allowed');

        await TestComponent.getInitialProps!(ctx);

        expect(ctx.res!.statusMessage).to.eql('Method Not Allowed');
    });

    it('should rethrow the Error given an Error object without a statusCode prop', async () => {
        ctx.err = new Error('test error');

        return expect(TestComponent.getInitialProps!(ctx)).to.eventually.be.rejectedWith(ctx.err);
    });

    it('should render the underlying component given an undefined status code', () => {
        const { container } = render(<TestComponent />);
        expect(container.getElementsByTagName('p')[0].textContent).to.eql('Success');
    });

    it('should render the underlying component given a non-error status code', () => {
        const { container } = render(<TestComponent statusCode={200} />);
        expect(container.getElementsByTagName('p')[0].textContent).to.eql('Success');
    });

    it('should render the default title given an error status code without a custom title', () => {
        const { container } = render(<TestComponent statusCode={404} />);
        expect(container.getElementsByTagName('h2')[0].textContent).to.eql('This page could not be found.');
    });

    it('should render the custom title given an error status code with a custom title', () => {
        const { container } = render(<TestComponent statusCode={403} />);
        expect(container.getElementsByTagName('h2')[0].textContent).to.eql(
            "You don't have permission to access the requested resource on this server.",
        );
    });
});
