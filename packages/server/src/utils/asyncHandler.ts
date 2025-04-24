// importing types
import type { Request, Response, NextFunction } from 'express';
// importing utils
import { apiError } from './apiError.js';
import { apiResponse } from './apiResponse.js';

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export const asyncHandler = (requestHandler: AsyncRequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await requestHandler(req, res, next);
        } catch (error: unknown) {
            let errorToSend: apiError;

            // if it's our custom apiError
            if (error instanceof apiError) {
                errorToSend = error;
            }
            // if it's a standard Error object
            else if (error instanceof Error) {
                let message = error?.message?.toString();
                {/* TODO: send full error which will be shown in console */ }
                if (message.length > 64) {
                    message = message?.substring(0, 64) + '...';
                }
                errorToSend = new apiError({
                    code: 500,
                    message: message || 'Internal Server Error',
                    stack: error.stack
                });
            }
            // if something other than an Error was thrown
            else {
                errorToSend = new apiError({
                    code: 500,
                    message: 'An unexpected error occurred',
                });
            }

            res.json(new apiResponse({
                code: errorToSend.code,
                data: null,
                message: errorToSend.message,
            }));
        }
    };
};