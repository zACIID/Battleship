import axios, { AxiosRequestConfig } from 'axios';

import { LoginInfo } from '../../src/app/core/api/handlers/auth-api';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';

export interface SetupData {
    apiAuthCredentials: LoginInfo;
    insertedData: Object;
}

/**
 * Returns the configuration for an axios request
 * @param jwtProvider provider of the jwt that is used to set the Authorization header
 */
export const getAxiosReqConfig = (jwtProvider?: JwtProvider): AxiosRequestConfig => {
    return {
        headers: {
            Authorization: `Bearer ${jwtProvider?.getToken()}`,
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
        },
    };
};
