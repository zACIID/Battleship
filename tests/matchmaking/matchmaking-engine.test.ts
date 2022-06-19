import * as http from 'http';
import * as io from 'socket.io';
import * as ioClient from 'socket.io-client';
import { MatchmakingEngine } from '../../src/matchmaking/matchmaking-engine';
import chalk from 'chalk';
import { EngineAlreadyStoppedError } from '../../src/matchmaking/engine-errors';
import { UserDocument } from '../../src/model/database/user/user';
import { deleteMultipleUsers, insertMultipleUsers } from '../fixtures/users';
import { Types } from 'mongoose';

let httpServer: http.Server;
let ioServer: io.Server;
let engine: MatchmakingEngine;
const enginePollingTimeMs: number = 1000;

const baseSetup = async (): Promise<void> => {
    const serverPort: number = parseInt(process.env.PORT, 10);
    const serverHost: string = process.env.HOST;
    httpServer = http.createServer();
    ioServer = new io.Server(httpServer);

    httpServer.listen(serverPort, serverHost, () => {
        console.log(chalk.bgBlue('Started test http server'));
    });

    engine = new MatchmakingEngine(ioServer, enginePollingTimeMs);
};

const baseTeardown = async (): Promise<void> => {
    httpServer.close();
    ioServer.close();

    try {
        engine.stop();
    } catch (err) {
        if (err instanceof EngineAlreadyStoppedError) {
            console.log('Engine already stopped');
        }
    }
};

describe('Engine Start and Stop', () => {
    beforeEach(async () => {
        await baseSetup();
    });

    afterEach(async () => {
        await baseTeardown();
    });

    test('Should Not Throw', (done) => {
        expect(() => {
            engine.start();

            setTimeout(() => {
                engine.stop();

                done();
            }, enginePollingTimeMs * 5);
        }).not.toThrow();
    });
});

describe('Match arrangements', () => {
    let users: UserDocument[];

    beforeEach(async () => {
        await baseSetup();

        users = await insertMultipleUsers(8);
    });

    afterEach(async () => {
        await baseTeardown();

        const userIds: Types.ObjectId[] = users.map((u: UserDocument) => u._id);
        await deleteMultipleUsers(userIds);
    });

    test('');
});
