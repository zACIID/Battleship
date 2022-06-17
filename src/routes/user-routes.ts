import { getCurrentMatch, MatchDocument } from '../model/match/match';
import { UserDocument, UserStatus } from '../model/user/user';
import * as match from './../model/match/match';
import { Types } from 'mongoose';
import { Router, Response } from 'express';

import * as usr from '../model/user/user';
import { UserStats } from '../model/user/user-stats';
import { authenticateToken } from './auth-routes';
import { retrieveUserId, retrieveId, skipLimitChecker } from './utils/param-checking';
import { AuthenticatedRequest } from './utils/authenticated-request';
import { toApiMatchStats } from './utils/model-to-api-conversion';

interface UserEndpointLocals {
    userId: Types.ObjectId;
    skip: number;
    limit: number;
}

/**
 * Interface that models the response of a user endpoint
 */
interface UserEndpointResponse extends Response {
    locals: UserEndpointLocals;
}

interface UpdateStatsBody {
    elo: number;
    topElo: number;
    wins: number;
    losses: number;
    shipsDestroyed: number;
    totalHits: number;
    totalShots: number;
}

interface UpdateStatsRequest extends AuthenticatedRequest {
    body: UpdateStatsBody;
}

export const router = Router();

enum UserNotFoundErrors {
    SingleUser = 'No user with that identifier',
    MultipleUsers = 'None of the given ids are present in the db',
}

router.get(
    '/users/:userId',
    authenticateToken,
    retrieveUserId,
    async (req: AuthenticatedRequest, res: UserEndpointResponse) => {
        let user: usr.UserDocument;
        const userId: Types.ObjectId = res.locals.userId;
        try {
            user = await usr.getUserById(userId);

            return res.status(201).json({
                userId: user._id,
                username: user.username,
                roles: user.roles,
                status: user.status,
                elo: user.stats.elo,
            });
        } catch (err) {
            const statusCode: number = err.message === UserNotFoundErrors.SingleUser ? 404 : 500;
            return res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

router.get(
    '/users/:userId/matches',
    authenticateToken,
    skipLimitChecker,
    retrieveUserId,
    async (req: AuthenticatedRequest, res: UserEndpointResponse) => {
        try {
            const userId: Types.ObjectId = res.locals.userId;

            // If parameters are not passed,
            // they are assigned the value -1 by the middleware
            let skip: number = res.locals.skip;
            let limit: number = res.locals.limit;

            // Set default value for skip
            if (skip === -1) {
                skip = 0;
            }

            // Default value here is 10 for limit
            if (limit === -1) {
                limit = 10;
            }

            const matchDocuments: MatchDocument[] = await match.getUserMostRecentMatches(
                userId,
                skip,
                limit
            );

            // "Convert" the matches into a suitable response object for the api
            const responseMatches = matchDocuments.map((mDoc: MatchDocument) => {
                return {
                    matchId: mDoc._id,
                    player1: mDoc.player1,
                    player2: mDoc.player2,
                    playersChat: mDoc.playersChat,
                    observersChat: mDoc.observersChat,
                    stats: toApiMatchStats(mDoc.stats),
                };
            });
            const responseData = {
                matches: responseMatches,
                nextPage: `${req.path}?skip=${skip + limit}&limit=${limit}`,
            };

            return res.status(200).json(responseData);
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

router.get(
    '/users/:userId/currentMatch',
    authenticateToken,
    retrieveUserId,
    async (req: AuthenticatedRequest, res: UserEndpointResponse) => {
        const userId: Types.ObjectId = res.locals.userId;
        try {
            // Get the current match.
            // An error is thrown if the user is not in a game
            await match.getCurrentMatch(userId);
        } catch (err) {
            const statusCode: number = err.message === UserNotFoundErrors.SingleUser ? 404 : 400;
            return res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

interface UpdateUsernameBody {
    username: string;
}

interface UpdateUsernameRequest extends AuthenticatedRequest {
    body: UpdateUsernameBody;
}

router.put(
    '/users/:userId/username',
    authenticateToken,
    retrieveUserId,
    async (req: UpdateUsernameRequest, res: UserEndpointResponse) => {
        const { username } = req.body;

        const userId: Types.ObjectId = res.locals.userId;

        if (username) {
            try {
                await usr.updateUserName(userId, username);
                return res.status(200).json({ username });
            } catch (err) {
                const statusCode: number =
                    err.message === UserNotFoundErrors.SingleUser ? 404 : 500;
                return res.status(statusCode).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: err.message,
                    requestPath: req.path,
                });
            }
        } else {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: 'Wrong parameters',
                requestPath: req.path,
            });
        }
    }
);

interface UpdatePasswordBody {
    password: string;
}

interface UpdatePasswordRequest extends AuthenticatedRequest {
    body: UpdatePasswordBody;
}

router.put(
    '/users/:userId/password',
    authenticateToken,
    retrieveUserId,
    async (req: UpdatePasswordRequest, res: UserEndpointResponse) => {
        const { password } = req.body;
        const userId: Types.ObjectId = res.locals.userId;
        if (password) {
            try {
                await usr.updatePassword(userId, password);
                return res.sendStatus(204);
            } catch (err) {
                const statusCode: number =
                    err.message === UserNotFoundErrors.SingleUser ? 404 : 500;
                return res.status(statusCode).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: err.message,
                    requestPath: req.path,
                });
            }
        } else {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: 'Wrong parameters',
                requestPath: req.path,
            });
        }
    }
);

router.delete(
    '/users/:userId',
    authenticateToken,
    retrieveUserId,
    async (req: AuthenticatedRequest, res: UserEndpointResponse) => {
        const userId: Types.ObjectId = res.locals.userId;

        try {
            await usr.deleteUser({ _id: userId });
            return res.status(204).json();
        } catch (err) {
            const statusCode: number = err.message === UserNotFoundErrors.SingleUser ? 404 : 500;
            return res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

router.get(
    '/users/:userId/stats',
    authenticateToken,
    retrieveUserId,
    async (req: AuthenticatedRequest, res: UserEndpointResponse) => {
        const userId: Types.ObjectId = res.locals.userId;
        let stats: UserStats;
        try {
            stats = await usr.getUserStats(userId);
            return res.status(200).json({
                elo: stats.elo,
                topElo: stats.topElo,
                wins: stats.wins,
                losses: stats.losses,
                shipsDestroyed: stats.shipsDestroyed,
                totalShots: stats.totalShots,
                totalHits: stats.totalHits,
            });
        } catch (err) {
            const statusCode: number = err.message === UserNotFoundErrors.SingleUser ? 404 : 500;
            return res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

router.put(
    '/users/:userId/stats',
    authenticateToken,
    retrieveUserId,
    async (req: UpdateStatsRequest, res: UserEndpointResponse) => {
        const userId: Types.ObjectId = res.locals.userId;
        const { elo, topElo, wins, losses, shipsDestroyed, totalShots, totalHits } = req.body;

        try {
            await usr.updateUserStats(
                userId,
                elo,
                topElo,
                wins,
                losses,
                shipsDestroyed,
                totalShots,
                totalHits
            );
            return res
                .status(200)
                .json({ elo, topElo, wins, losses, shipsDestroyed, totalShots, totalHits });
        } catch (err) {
            const statusCode: number = err.message === UserNotFoundErrors.SingleUser ? 404 : 500;

            return res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

interface GetMultipleUsersBody {
    userIds: Types.ObjectId[];
}

interface GetMultipleUsersRequest extends AuthenticatedRequest {
    body: GetMultipleUsersBody;
}

router.get(
    '/users',
    authenticateToken,
    async (req: GetMultipleUsersRequest, res: UserEndpointResponse) => {
        try {
            const userIdsQParam: string[] = (req.query.ids as string).split(',');
            const userObjIds: Types.ObjectId[] = userIdsQParam.map((uId) => {
                return retrieveId(uId);
            });

            const users: usr.UserDocument[] = await usr.getUsers(userObjIds);
            const results = users.map((u: usr.UserDocument) => {
                return {
                    userId: u._id,
                    username: u.username,
                    roles: u.roles,
                    status: u.status,
                    elo: u.stats.elo,
                };
            });

            return res.status(200).json({ users: results });
        } catch (err) {
            let statusCode: number = 404;
            if (err instanceof Error && err.message === UserNotFoundErrors.MultipleUsers) {
                statusCode = 500;
            } else {
                return res.status(statusCode).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: err.message,
                    requestPath: req.path,
                });
            }

            return res.status(statusCode).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);
