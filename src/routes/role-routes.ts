import * as mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { UserDocument, getUserById, UserRoles } from '../models/user';
import { authenticateToken, retrieveUserId } from './auth-routes';
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
router.get('/users/:userId/roles', authenticateToken, retrieveUserId, async (req: Request, res: Response) => {
    const userId: Types.ObjectId = res.locals.userId;
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
router.post('/users/:userId/roles',
            authenticateToken,
            retrieveUserId,
            async (req: RoleRequest, res: Response) => {
    const userIdParam: Types.ObjectId = res.locals.userId;
    const roleParam: string = req.body.role;

    try {
        const user: UserDocument = await getUserById(userIdParam);

        // Dynamically extract UserRoles value based on roleParam
        const role: UserRoles = UserRoles[roleParam as keyof typeof UserRoles];
        await user.setRole(role);

        return res.status(200).json(role);
    } catch (err) {
        return res.status(500).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
});

/**
 *    /users/:userId/roles | DELETE | Remove a role from the specified user
 *    Returns an empty response or a 404 error
 */
router.delete(
    '/users/:userId/roles/:role',
    authenticateToken,
    retrieveUserId,
    async (req: RoleRequest, res: Response) => {
        const userId: Types.ObjectId = res.locals.userId;
        const roleParam: string = req.params.role;

        try {
            const user: UserDocument = await getUserById(userId);

            // Dynamically extract UserRoles value based on roleParam
            const role: UserRoles = UserRoles[roleParam as keyof typeof UserRoles];
            await user.removeRole(role);
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }

        return res.status(204).json();
    }
);
