import { environment } from '../../../src/environments/environment';
import axios, { AxiosResponse } from 'axios';
import { StateChangeBody } from '../../../src/app/core/api/handlers/match-api';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { getAxiosReqConfig } from '../utils';

export const changePlayerState = async (
    jwtProvider: JwtProvider,
    matchId: string,
    playerId: string,
    ready: boolean
): Promise<boolean> => {
    const reqUrl: string = `${environment.apiBaseUrl}/api/matches/${matchId}/players/:${playerId}/ready`;
    const reqBody: StateChangeBody = {
        ready: ready,
    };

    const res: AxiosResponse<StateChangeBody> = await axios.put<StateChangeBody>(
        reqUrl,
        reqBody,
        getAxiosReqConfig(jwtProvider)
    );

    return res.data.ready;
};
