import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { Request, Response, Router } from "express";
import { RequestTypes } from "../models/notification";
import { getUserById, UserDocument } from "../models/user";
import { authenticateToken, retrieveUserId } from "./auth-routes";

export const router = Router();

interface PostBody {
    type: string;
    sender: string;
}

interface NotificationRequest extends Request {
    body: PostBody;
}

/**
 *    /users/:userId/notifications | GET | Retrieve the notifications of the specified user
 */
router.get(
    '/users/:userId/notifications',
    authenticateToken,
    async (req: Request, res: Response) => {
        const userId: Types.ObjectId = Types.ObjectId(req.params.userId);

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

        // TODO check la paginazione
        return res.status(200).json({ notifications: user.notifications, nextPage: '' });
    }
);

/**
 *    /users/:userId/notifications | POST | Add a notification to the specified user
 */
router.post(
    '/users/:userId/notifications',
    authenticateToken,
    retrieveUserId,
    async (req: NotificationRequest, res: Response) => {
        const userId: Types.ObjectId = res.locals.userId;
        let user: UserDocument;

        try {
            const typeBodyParam: string = req.body.type;
            const senderBodyParam: string = req.body.sender;

            const reqType: RequestTypes = RequestTypes[typeBodyParam as keyof typeof RequestTypes];
            const senderObjId: Types.ObjectId = Types.ObjectId(senderBodyParam);

            user = await getUserById(userId);
            await user.addNotification(reqType, senderObjId);

            return res.status(200).json({
                                            type: reqType.toString(),
                                            sender: req.body.sender
                                        });
        } catch (err) {
            return res.status(500).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);

/**
 *   /users/:userId/notifications | DELETE | Remove the notification from the specified user
 *   Query params: type, sender
 */
router.delete(
    '/users/:userId/notifications',
    authenticateToken,
    retrieveUserId,
    async (req: NotificationRequest, res: Response) => {
        const userId: Types.ObjectId = res.locals.userId
        let user: UserDocument;

        try {
            const typeQParam: string = req.params.type as string;
            const senderQParam: string = req.params.sender as string;

            const reqType: RequestTypes = RequestTypes[typeQParam as keyof typeof RequestTypes];
            const senderObjId: Types.ObjectId = Types.ObjectId(senderQParam);

            user = await getUserById(userId);
            await user.removeNotification(reqType, senderObjId);
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
