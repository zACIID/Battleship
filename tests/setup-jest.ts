// There are some long-running tests
import mongoose from 'mongoose';
import chalk from 'chalk';
import { UserModel } from '../src/model/database/user/user';
import { ChatModel } from '../src/model/database/chat/chat';
import { MatchModel } from '../src/model/database/match/match';
import { MatchmakingQueueModel } from '../src/model/database/matchmaking/queue-entry';

jest.setTimeout(35000);

/**
 * Setup mongoose connection
 */
beforeAll(async () => {
    // If testing, set test db uri, else use the other
    const IS_TESTING_MODE: boolean = process.env.TEST === 'true';
    const dbUri: string = IS_TESTING_MODE ? process.env.TEST_DB_URI : process.env.DB_URI;

    // Connect to the database
    await mongoose
        .connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log(chalk.bgGreen('Connected to Db')));
});

/**
 * Empty database after all tests have run, then
 * close the mongoose connection
 */
afterAll(async () => {
    await UserModel.deleteMany({});
    await ChatModel.deleteMany({});
    await MatchModel.deleteMany({});
    await MatchmakingQueueModel.deleteMany({});

    await mongoose.connection.close();

    console.log(chalk.bgGreen('Connection to Db closed'));
});
