import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { getAxiosReqConfig } from '../utils';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { Notification } from '../../../src/app/core/model/user/notification';
import { environment } from '../../../src/environments/environment';

export const sendNotification = async (
    senderJwtProvider: JwtProvider,
    newNotification: Notification,
    receiverId: string
): Promise<Notification> => {
    const reqUrl: string = `${environment.serverBaseUrl}/api/users/${receiverId}/notifications`;
    const reqConfig: AxiosRequestConfig = getAxiosReqConfig(senderJwtProvider);

    const apiRes: AxiosResponse<Notification> = await axios.post<Notification>(
        reqUrl,
        newNotification,
        reqConfig
    );

    return apiRes.data;
};

export const removeNotification = async (
    senderJwtProvider: JwtProvider,
    notificationToRemove: Notification,
    receiverId: string
): Promise<void> => {
    const { type, sender } = notificationToRemove;
    const queryParams: string = `type=${type}&sender=${sender}`;

    const reqUrl: string = `${environment.serverBaseUrl}/api/users/${receiverId}/notifications?${queryParams}`;
    const reqConfig: AxiosRequestConfig = getAxiosReqConfig(senderJwtProvider);

    await axios.delete(reqUrl, reqConfig);
};
