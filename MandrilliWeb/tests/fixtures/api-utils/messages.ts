import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { getAxiosReqConfig } from '../utils';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { environment } from '../../../src/environments/environment';
import { Message } from '../../../src/app/core/model/chat/message';
import { ApiMessage, toApiMessage } from '../../../src/app/core/model/api/chat/api-message';

export const sendMessage = async (
    senderJwtProvider: JwtProvider,
    chatId: string,
    message: Message
): Promise<ApiMessage> => {
    const reqUrl: string = `${environment.serverBaseUrl}/chats/${chatId}/messages`;
    const reqConfig: AxiosRequestConfig = getAxiosReqConfig(senderJwtProvider);

    const apiRes: AxiosResponse<ApiMessage> = await axios.post<ApiMessage>(
        reqUrl,
        toApiMessage(message),
        reqConfig
    );

    return apiRes.data;
};
