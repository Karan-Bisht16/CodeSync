export type ApiResponse = {
    code: number,
    data?: any,
    message: string,
    success: boolean,
    errors?: any,
    stack?: string,
};