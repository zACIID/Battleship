import { Router, Response } from 'express';
import { UserDocument, getUserById, createUser, deleteUser, UserRoles } from '../models/user/user';
import { authenticateToken } from './auth-routes';
import { retrieveUserId } from './utils/param-checking';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../models/auth/authenticated-request';

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
                const newMod: UserDocument = await createUser(req.body);
                await newMod.setRole(UserRoles.Moderator);

                return res.status(201).json({
                    userId: newMod._id,
                    username: newMod.username,
                    roles: newMod.roles,
                    online: newMod.online,
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
    userId: Types.ObjectId;
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
                await deleteUser(req.body.userId);

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
