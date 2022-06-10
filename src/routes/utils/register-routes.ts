import { Express } from 'express';

import { router as authRouter } from '../auth-routes';
import { router as chatRouter } from '../chat-routes';
import { router as leaderboardRouter } from '../leaderboard-routes';
import { router as matchRouter } from '../match-routes';
import { router as matchmakingRouter } from '../matchmaking-routes';
import { router as modRouter } from '../moderator-routes';
import { router as notificationRouter } from '../notification-routes';
import { router as userRouter } from '../user-routes';
import { router as relRouter } from '../relationship-routes';
import { router as mongoDbApiRouter } from '../frontend-integration-testing/mongodb-api-routes';
import { API_BASE_URL, IS_TESTING_MODE } from '../../index';

export const registerRoutes = (app: Express) => {
    app.use(API_BASE_URL, authRouter);
    app.use(API_BASE_URL, chatRouter);
    app.use(API_BASE_URL, leaderboardRouter);
    app.use(API_BASE_URL, matchRouter);
    app.use(API_BASE_URL, matchmakingRouter);
    app.use(API_BASE_URL, modRouter);
    app.use(API_BASE_URL, notificationRouter);
    app.use(API_BASE_URL, relRouter);
    app.use(API_BASE_URL, userRouter);

    if (IS_TESTING_MODE) {
        app.use(API_BASE_URL, mongoDbApiRouter);
    }
};
