import React from 'react';
import ErrorPage from 'next/error';
import { NextPageContext, NextPage } from 'next';
import { CsrfProps, HttpError, RedirectError, withCsrfToken } from '../pageFunctions';

export interface WithErrorProps extends CsrfProps {
    statusCode?: number;
}

interface ErrorTitles<T> {
    [id: string]: T;
}

const errorTitles: ErrorTitles<string> = {
    403: "You don't have permission to access the requested resource on this server",
};

export function withError<T>(WrappedComponent: NextPage<T>): React.ComponentType<T & WithErrorProps> {
    const WithError: NextPage<T & WithErrorProps> = props => {
        const { statusCode } = props;
        if (statusCode && HttpError.isError(statusCode)) {
            return <ErrorPage statusCode={statusCode} title={errorTitles[statusCode]} />;
        }
        return <WrappedComponent {...props} />;
    };

    WithError.getInitialProps = async (ctx: NextPageContext): Promise<T & WithErrorProps> => {
        let initialProps, statusCode;
        try {
            initialProps = WrappedComponent.getInitialProps ? await WrappedComponent.getInitialProps(ctx) : null;
            if (ctx.res && ctx.res.statusCode) {
                statusCode = ctx.res.statusCode;
            }
        } catch (error) {
            if (error instanceof HttpError && error.statusCode) {
                statusCode = error.statusCode;
                if (ctx.res) {
                    ctx.res.statusCode = statusCode;
                    ctx.res.statusMessage = error.message;
                }
            } else if (error instanceof RedirectError) {
                const responseCode = error.preserveData ? 307 : 302;
                ctx.res!.writeHead(responseCode, { Location: error.location });
                ctx.res!.end();
                ctx.res!.statusCode = responseCode;
            } else {
                throw error;
            }
        }
        return withCsrfToken({ statusCode, ...initialProps }, ctx.req) as T & WithErrorProps;
    };

    return WithError;
}
