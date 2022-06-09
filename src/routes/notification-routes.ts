import { Types } from 'mongoose';
import { Response, Router } from 'express';

import { RequestTypes } from '../model/user/notification';
import { getUserById, UserDocument } from '../model/user/user';
import { authenticateToken } from './auth-routes';
import { retrieveUserId, retrieveId } from './utils/param-checking';
import { NotificationReceivedEmitter } from '../events/emitters/notification-received';
import { ioServer } from '../index';
import { AuthenticatedRequest } from './utils/authenticated-request';
import { NotificationData } from '../model/events/notification-data';
import { NotificationDeletedEmitter } from '../events/emitters/notification-deleted';
import { Emitter } from '../events/emitters/base/emitter';

export const router = Router();

interface PostBody {
    type: string;
    sender: string;
}

interface NotificationRequest extends AuthenticatedRequest {
    body: PostBody;
}

// TODO could be an enum
const errorMessages: string[] = [
    'No user with that identifier',
    'Notification not found',
    'Notification already sent',
];

/**
 *    /users/:userId/notifications | GET | Retrieve the notifications of the specified user
 */
router.get(
    '/users/:userId/notifications',
    authenticateToken,
    retrieveUserId,
    async (req: AuthenticatedRequest, res: Response) => {
        const userId: Types.ObjectId = res.locals.userId;

        try {
            const user: UserDocument = await getUserById(userId);
            return res.status(200).json({ notifications: user.notifications });
        } catch (err) {
            return res.status(404).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
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

        try {
            const typeBodyParam: string = req.body.type as string;
            const senderQParam: string = req.body.sender as string;

            const reqType: RequestTypes = RequestTypes[typeBodyParam as keyof typeof RequestTypes];

            const user: UserDocument = await getUserById(userId);
            const senderObjId: Types.ObjectId = retrieveId(senderQParam);

            // Check if sender exists
            await getUserById(senderObjId);

            await user.addNotification(reqType, senderObjId);

            // Notify the user of the new notification
            const notifier = new NotificationReceivedEmitter(ioServer, userId);

            const notificationData: NotificationData = {
                type: reqType,
                sender: senderObjId.toString(),
            };
            notifier.emit(notificationData);

            return res.status(201).json(notificationData);
        } catch (err) {
            let status: number = errorMessages.find((e) => e === err.message) ? 404 : 500;

            return res.status(status).json({
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
        const userId: Types.ObjectId = res.locals.userId;

        try {
            const typeQParam: string = req.query.type as string;
            const senderQParam: string = req.query.sender as string;

            const reqType: RequestTypes = RequestTypes[typeQParam as keyof typeof RequestTypes];
            const senderObjId: Types.ObjectId = retrieveId(senderQParam);

            // Check if users exist
            // TODO it is not clear here that getUserById is used to check if user exists
            const user: UserDocument = await getUserById(userId);
            const sender: UserDocument = await getUserById(senderObjId);

            await user.removeNotification(reqType, senderObjId);

            // Notify the user of the new notification
            const notifier = new NotificationDeletedEmitter(ioServer, userId);

            const notificationData: NotificationData = {
                type: reqType,
                sender: senderObjId.toString(),
            };
            notifier.emit(notificationData);

            return res.status(204).json();
        } catch (err) {
            const status: number = errorMessages.find((e) => e === err.message) ? 404 : 500;
            return res.status(status).json({
                timestamp: Math.floor(new Date().getTime() / 1000),
                errorMessage: err.message,
                requestPath: req.path,
            });
        }
    }
);
