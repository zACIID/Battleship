// There are some long-running tests
import mongoose from 'mongoose';
import chalk from 'chalk';

jest.setTimeout(35000);

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
        .then(() => console.log(chalk.bgYellow('Connected to Db')));
});

afterAll(async () => {
    await mongoose.connection.close();
});
