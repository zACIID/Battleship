import * as dotenv from 'dotenv';
import path from 'path';

import { Request, Response, Router } from 'express';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const router = Router();

/**
 * Returns the necessary information to access the MongoDb Data Api
 *
 * This route is important because it allows the client to retrieve the required secrets
 * (notably the api-key) to make requests to the MongoDb Data Api. This allows the client to directly
 * perform operations in the database, which is useful for integration testing purposes.
 */
router.get('/testing/mongoDbApi/config', async (req: Request, res: Response) => {
    // TODO
});
