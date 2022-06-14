import { environment } from '../../../src/environments/environment';
import axios, { AxiosResponse } from 'axios';
import { StateChangeBody } from '../../../src/app/core/api/handlers/match-api';
import { JwtProvider } from '../../../src/app/core/api/jwt-auth/jwt-provider';
import { getAxiosReqConfig } from '../utils';
import { Shot } from '../../../src/app/core/model/api/match/shot';
import { GridCoordinates } from '../../../src/app/core/model/match/coordinates';

export const changePlayerState = async (
    jwtProvider: JwtProvider,
    matchId: string,
    playerId: string,
    ready: boolean
): Promise<boolean> => {
    const reqUrl: string = `${environment.apiBaseUrl}/api/matches/${matchId}/players/${playerId}/ready`;
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

export const fireShot = async (
    jwtProvider: JwtProvider,
    matchId: string,
    shot: Shot
): Promise<GridCoordinates> => {
    const reqUrl: string = `${environment.apiBaseUrl}/api/matches/${matchId}/players/${shot.playerId}/shotsFired`;
    const reqBody: GridCoordinates = shot.coordinates;

    const res: AxiosResponse<GridCoordinates> = await axios.post<GridCoordinates>(
        reqUrl,
        reqBody,
        getAxiosReqConfig(jwtProvider)
    );

    return res.data;
};
