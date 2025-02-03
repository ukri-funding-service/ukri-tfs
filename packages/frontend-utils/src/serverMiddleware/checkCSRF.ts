import { getFlattenedPathParam } from '@ukri-tfs/tfs-request';
import { NextApiResponse } from 'next';
import { CsrfProps, ForbiddenError, HttpError, isCsrfSafe, MethodNotAllowedError } from '../pageFunctions';
import { isGetMethod } from '../pageFunctions/isGetMethod';
import { NextApiHandlerWithContext, NextApiRequestWithContext } from './withApiAuthorisation';

export function checkCSRF<T>(handler: NextApiHandlerWithContext<T | {}>): NextApiHandlerWithContext<T | {}> {
    return async (req: NextApiRequestWithContext, res: NextApiResponse<T | {}>) => {
        try {
            if (isGetMethod(req)) {
                throw new MethodNotAllowedError('Allowed methods: POST PUT PATCH DELETE');
            }

            const postData = getPostData(req);

            if (!isCsrfSafe(req, postData)) {
                throw new ForbiddenError('CSRF token is invalid');
            }

            return handler(req, res);
        } catch (error) {
            if (error instanceof HttpError && error.statusCode) {
                const statusCode = error.statusCode;
                if (res) {
                    res.statusCode = statusCode;
                    res.statusMessage = error.message;
                }
                res.status(statusCode);
                res.send({});
            } else {
                throw error;
            }
        }
    };
}

function getPostData(req: NextApiRequestWithContext): CsrfProps {
    const xsrfToken = req.headers['xsrf-token'] ?? req.headers['XSRF-TOKEN'];
    const csrfToken = getFlattenedPathParam(xsrfToken || '');
    return {
        csrfToken,
    };
}
