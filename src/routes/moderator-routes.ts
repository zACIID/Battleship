import { Router, Response } from 'express';
import { UserDocument, createUser, deleteUser, UserRoles, UserStatus } from '../model/user/user';
import { authenticateToken } from './auth-routes';
import { retrieveUserId } from './utils/param-checking';
import { AuthenticatedRequest } from './utils/authenticated-request';
import { AnyKeys } from 'mongoose';

export const router = Router();

interface AddModeratorBody {
    username: string;
    password: string;
}

interface AddModRequest extends AuthenticatedRequest {
    body: AddModeratorBody;
}

/**
 *    Check if the user is a moderator and create a new user using request body data
 *   The check is done by verifying the content of the jwt
 *    /moderators/additions   |   POST
 */
router.post(
    '/moderators/additions',
    authenticateToken,
    retrieveUserId,
    async (req: AddModRequest, res: Response) => {
        try {
            if (req.jwtContent.roles.includes(UserRoles.Moderator)) {
                const newModInfo: AnyKeys<UserDocument> = {
                    username: req.body.username,

                    // Status is set to temporary because its credentials have to be changed
                    // at the first login
                    status: UserStatus.Temporary,
                };
                const newMod: UserDocument = await createUser(newModInfo);
                await newMod.setRole(UserRoles.Moderator);

                // TODO Consider doing this instead:
                // https://stackoverflow.com/questions/14588032/mongoose-password-hashing
                await newMod.setPassword(req.body.password);

                return res.status(201).json({
                    userId: newMod._id,
                    username: newMod.username,
                    roles: newMod.roles,
                    status: newMod.status,
                    elo: newMod.stats.elo,
                });
            } else
                return res.status(403).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: `Unauthorized: user ${req.jwtContent.userId} is not a moderator`,
                    requestPath: req.path,
                });
        } catch (err) {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

interface BanUserBody {
    username: string;
}

interface BanUserRequest extends AuthenticatedRequest {
    body: BanUserBody;
}

/**
 *    Check if the user is a moderator and delete a user identified by the id found in the request body
 *    The check is done by verifying the content of the jwt
 *    /moderators/bans   |   POST
 */
router.post(
    '/moderators/bans',
    authenticateToken,
    retrieveUserId,
    async (req: BanUserRequest, res: Response) => {
        try {
            if (req.jwtContent.roles.includes(UserRoles.Moderator)) {
                await deleteUser({ username: req.body.username });

                return res.status(204).json();
            } else
                res.status(403).json({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    errorMessage: `Unauthorized: user ${req.jwtContent.userId} is not a moderator`,
                    requestPath: req.path,
                });
        } catch (err) {
            return res.status(400).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);
