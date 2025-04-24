// importing lib
import { API } from '../lib/axios';
// importing types
import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '../types/API.types';

export const pingServer = (): Promise<AxiosResponse<ApiResponse> | undefined> => {
    return API.get('/');
};