import * as mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { UserDocument, User, getUserById, UserRoles } from '../models/user';
import { authenticateToken } from './auth-routes';
import { Types } from 'mongoose';

export const router = Router();

interface RolePostBody {
    role: string;
}

interface RoleRequest extends Request {
    body: RolePostBody;
}

/**
 *   /users/:userId/roles | GET | Retrieve the roles of the specified user
 *   Returns the list of roles of the provided user, a 404 error if user is not found
 */
router.get('/users/:userId/roles', authenticateToken, async (req: Request, res: Response) => {
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    let user: UserDocument;

    try {
        user = await getUserById(userId);
    } catch (err) {
        return res.status(404).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }

    return res.status(200).json(user.roles);
});

/**
 *    /users/:userId/roles | POST | Add a role to the specified user
 *    Returns the new role or a 500 error
 */
router.post('/users/:userId/roles', authenticateToken, async (req: RoleRequest, res: Response) => {
    const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
    let user: UserDocument;
    const role: UserRoles = UserRoles[UserRoles[req.body.role]];

    try {
        user = await getUserById(userId);
        user.setRole(role);
    } catch (err) {
        return res.status(500).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }

    return res.status(200).json(role);
});

/**
 *    /users/:userId/roles | DELETE | Remove a role from the specified user
 *    Returns an empty responde or a 404 error
 */
router.delete(
    '/users/:userId/roles',
    authenticateToken,
    async (req: RoleRequest, res: Response) => {
        const userId: Types.ObjectId = mongoose.Types.ObjectId(req.params.userId);
        let user: UserDocument;
        const role: UserRoles = UserRoles[UserRoles[req.body.role]];

        try {
            user = await getUserById(userId);
            user.removeRole(role);
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }

        return res.status(200).json();
    }
);
