import * as dotenv from 'dotenv';
import path from 'path';

import { Request, Response, Router } from 'express';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const router = Router();

interface MongoDpApiCredentials {
    apiBaseUrl: string;
    clusterName: string;
    apiKey: string;
}

/**
 * Returns the necessary information to access the MongoDb Data Api
 *
 * This route is important because it allows the client to retrieve the required secrets
 * (notably the api-key) to make requests to the MongoDb Data Api. This allows the client to directly
 * perform operations in the database, which is useful for integration testing purposes.
 */
router.get('/testing/mongoDbApi/credentials', async (req: Request, res: Response) => {
    try {
        const apiCred: MongoDpApiCredentials = {
            apiBaseUrl: process.env.MONGO_DB_API_URL,
            clusterName: process.env.MONGO_DB_CLUSTER_NAME,
            apiKey: process.env.MONGO_DB_API_KEY,
        };

        return res.status(200).json(apiCred);
    } catch (err) {
        return res.status(400).json({
            timestamp: Math.floor(new Date().getTime() / 1000),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
});
