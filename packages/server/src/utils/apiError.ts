export class apiError extends Error {
    code: number;
    data: any;
    message: string;
    errors?: any;
    success: boolean;

    constructor(error: {
        code: number,
        message: string,
        errors?: any,
        stack?: string
    }) {
        const { code, message, errors, stack } = error;
        super(message);
        this.code = code;
        this.data = null;
        this.message = message;
        this.errors = errors;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    };
}