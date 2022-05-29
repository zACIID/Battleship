import {Types} from 'mongoose';
import {Request, Response, Router} from 'express';

import {RequestTypes} from '../models/user/notification';
import {getUserById, UserDocument} from '../models/user/user';
import {authenticateToken} from './auth-routes';
import {retrieveUserId, retrieveId} from './utils/param-checking';

export const router = Router();

interface PostBody {
  type: string;
  sender: string;
}

interface NotificationRequest extends Request {
  body: PostBody;
}

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
  async (req: Request, res: Response) => {
    const userId: Types.ObjectId = res.locals.userId;

    try {
      const user: UserDocument = await getUserById(userId);
      return res.status(200).json({notifications: user.notifications});
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

      return res.status(201).json({
        type: reqType.toString(),
        sender: req.body.sender,
      });
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
      const user: UserDocument = await getUserById(userId);
      const sender: UserDocument = await getUserById(senderObjId);

      await user.removeNotification(reqType, senderObjId);

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
