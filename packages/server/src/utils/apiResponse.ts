export class apiResponse {
    code: number;
    data: any;
    message: string;
    success: boolean;

    constructor(response: {
        code: number,
        data: any,
        message: string
    }) {
        const { code, data, message } = response;
        this.code = code;
        this.data = data;
        this.message = message || 'Success';
        this.success = code < 400;
    };
}