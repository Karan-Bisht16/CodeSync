// importing types
import type { Request, Response } from 'express';
// importing utils
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const healthCheck = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200)
        .json(new apiResponse({
            code: 200,
            data: true,
            message: 'Server is active'
        }));
});

export {
    healthCheck,
};