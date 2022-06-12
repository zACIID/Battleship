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
    const addNotificationReqUrl: string = `${environment.apiBaseUrl}/api/users/${receiverId}/notifications`;
    const reqConfig: AxiosRequestConfig = getAxiosReqConfig(senderJwtProvider);
    const apiRes: AxiosResponse<Notification> = await axios.post<Notification>(
        addNotificationReqUrl,
        newNotification,
        reqConfig
    );

    return apiRes.data;
};
