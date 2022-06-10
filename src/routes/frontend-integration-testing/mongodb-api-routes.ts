import * as dotenv from 'dotenv';
import path from 'path';

import { Request, Response, Router } from 'express';
import * as process from 'process';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const router = Router();

interface MongoDpApiCredentials {
    apiBaseUrl: string;
    apiKey: string;
    clusterName: string;
    dbName: string;
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
            dbName: getTestDbName(),
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

const getTestDbName = (): string => {
    // The string format is the following:
    // mongodb+srv://<username>:<pwd>@<cluster-name>.<some-id>.mongodb.net/<dbName>?retryWrites=true&w=majority
    const testDbUri: string = process.env.TEST_DB_URI;
    const afterLastSlash: string = testDbUri.split('/')[3];
    const dbName: string = afterLastSlash.split('?')[0];

    return dbName;
};
