import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { getAxiosReqConfig } from '../utils';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { Notification } from '../../../src/app/core/model/user/notification';
import { environment } from '../../../src/environments/environment';
import { ChatMessage } from 'src/app/core/model/events/chat-message';
import { deleteChat } from '../../../../src/model/chat/chat';

export const sendMessage = async (
    senderJwtProvider: JwtProvider,
    chatId: string
): Promise<ChatMessage> => {
    const reqUrl: string = `${environment.serverBaseUrl}/chats/${chatId}/messages`;
    const reqConfig: AxiosRequestConfig = getAxiosReqConfig(senderJwtProvider);

    const apiRes: AxiosResponse<ChatMessage> = await axios.post<ChatMessage>(
        reqUrl,
        'New Message',
        reqConfig
    );

    return apiRes.data;
};
