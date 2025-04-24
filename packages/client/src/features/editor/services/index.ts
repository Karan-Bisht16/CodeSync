// importing lib
import { API } from '../../../lib/axios';
// importing types
import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '../../../types/API.types';

type ExecuteCodeData = {
    languageChoice: string,
    program: string,
    input: string,
};

type FormatCodeData = {
    code: string,
    language: string,
};

export const executeCode = (data: ExecuteCodeData): Promise<AxiosResponse<ApiResponse> | undefined> => {
    return API.post('/codeOperation/executeCode', data);
};

export const formatCode = (data: FormatCodeData): Promise<AxiosResponse<ApiResponse> | undefined> => {
    return API.post('/codeOperation/formatCode', data);
};