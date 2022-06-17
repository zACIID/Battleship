import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { Relationship } from '../../../src/app/core/model/user/relationship';
import { getAxiosReqConfig } from '../utils';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { environment } from '../../../src/environments/environment';

/**
 * Adds a relationship that involves the two specified users.
 * The addition is symmetrical, which means that the relationship is added to both users,
 * not just to one.
 * @param jwtProvider provider of jwt used to authenticate with the backend api
 * @param selfId id of the first user
 * @param friendId id of the second user
 */
export const addRelationship = async (
    jwtProvider: JwtProvider,
    selfId: string,
    friendId: string
): Promise<Relationship> => {
    const url: string = `${environment.serverBaseUrl}/api/users/${selfId}/relationships`;
    const axiosReqConfig: AxiosRequestConfig = getAxiosReqConfig(jwtProvider);
    const reqBody = {
        friendId: friendId,
    };

    const res: AxiosResponse = await axios.post<Relationship>(url, reqBody, axiosReqConfig);

    return res.data;
};

/**
 * Removes a relationship that involves the two specified users.
 * The deletion is symmetrical, which means that the relationship is deleted for both users,
 * not just for one.
 * @param jwtProvider provider of jwt used to authenticate with the backend api
 * @param selfId id of the first user
 * @param friendId id of the second user
 */
export const removeRelationship = async (
    jwtProvider: JwtProvider,
    selfId: string,
    friendId: string
): Promise<void> => {
    try {
        const url: string = `${environment.serverBaseUrl}/api/users/${selfId}/relationships/${friendId}`;
        const axiosReqConfig: AxiosRequestConfig = getAxiosReqConfig(jwtProvider);

        await axios.delete(url, axiosReqConfig);

        return Promise.resolve();
    } catch (err) {
        throw err;
    }
};
