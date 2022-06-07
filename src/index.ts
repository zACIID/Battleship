import * as dotenv from 'dotenv';
import * as path from 'path';
import * as http from 'http';
import { inspect } from 'util';

import express, { Express, Request } from 'express';
import cors from 'cors';
import * as io from 'socket.io';
import mongoose = require('mongoose');
import filter = require('content-filter');
import chalk from 'chalk';

import { registerRoutes } from './routes/utils/register-routes';
import { MatchmakingEngine } from './events/matchmaking-engine';
import { ChatJoinedListener } from './events/socket-io/client-listeners/chat-joined';
import { MatchJoinedListener } from './events/socket-io/client-listeners/match-joined';
import { ServerJoinedListener } from './events/socket-io/client-listeners/server-joined';
import { MatchRequestAcceptedListener } from './events/socket-io/client-listeners/match-request-accepted';
import { FriendRequestAcceptedListener } from './events/socket-io/client-listeners/friend-request-accepted';
import { ChatLeftListener } from './events/socket-io/client-listeners/chat-left';
import { MatchLeftListener } from './events/socket-io/client-listeners/match-left';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const app: Express = express();

// If testing, set test db uri, else use the other
export const isTesting: boolean = process.env.TEST === 'true';
const dbUri: string = isTesting ? process.env.TEST_DB_URI : process.env.DB_URI;
const serverPort: number = parseInt(process.env.PORT, 10);

/* Database Connection */
console.log('Demanding the sauce...');
mongoose
    .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Sauce received!');
    })
    .catch((err) => {
        console.log('Error Occurred during Mongoose Connection');
        console.log(err);
    });

const httpServer: http.Server = http.createServer(app);

httpServer.listen(serverPort, () => console.log(`HTTP Server started on port ${serverPort}`));

// Logging functionality to understand what requests arrive to the server
httpServer.addListener('request', (req: Request) => {
    console.log(chalk.magenta.bold(`Request received: ${req.method} ${req.url}`));

    // inspect replaces circular references in the json with [Circular]
    console.log(chalk.yellow(inspect(req.body)));
});

/* Creation of JWT middleware TODO remove? */
//var auth = jwt( {secret: process.env.JWT_SECRET} );

/* Allows server to respond to a particular request that asks which request options it accepts */
app.use(cors());

/* Alternative to bodyparser which is deprecated */
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// Allow cross-origin
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

/* Sanitize input to avoid NoSQL injections */
app.use(filter({ methodList: ['GET', 'POST', 'PATCH', 'DELETE'] }));

/* Endpoints base url */
export const API_BASE_URL: string = process.env.API_BASE_URL;

/* Socket.io server setup */
export const ioServer: io.Server = new io.Server(httpServer);

ioServer.on('connection', async function (client) {
    console.log(chalk.green(`Socket.io client ${client.id} connected`));

    client.on('disconnect', function () {
        console.log(chalk.redBright(`Socket.io client ${client.id} disconnected`));
    });

    /* Join listeners are being setup for each client.
     * They are important to make clients join specific rooms
     * so that the server can send events specifically to them.
     * This improves efficiency on both server and client side.
     */

    // A client joins its private room, so that the server has a way//
    // to send request specifically to him
    const serverJoined: ServerJoinedListener = new ServerJoinedListener(client);
    serverJoined.listen();

    // A client joins/leaves a specific chat room
    const chatJoined: ChatJoinedListener = new ChatJoinedListener(client);
    chatJoined.listen();

    const chatLeft: ChatLeftListener = new ChatLeftListener(client);
    chatLeft.listen();

    // A client joins/leaves a specific match room
    const matchJoined: MatchJoinedListener = new MatchJoinedListener(client);
    matchJoined.listen();

    const matchLeft: MatchLeftListener = new MatchLeftListener(client);
    matchLeft.listen();

    /* Other listeners for client events */

    // A client accepts a match request
    const matchReqAccepted: MatchRequestAcceptedListener = new MatchRequestAcceptedListener(
        client,
        ioServer
    );
    await matchReqAccepted.listen();

    // A client accepts a friend request
    const friendReqAccepted: FriendRequestAcceptedListener = new FriendRequestAcceptedListener(
        client,
        ioServer
    );
    await friendReqAccepted.listen();
});

/* Register express routes */
registerRoutes(app);

/* Start the matchmaking engine and tell him to try to look
 * for match arrangements every 5 seconds
 */
const queuePollingTimeMs: number = 5000;
const matchmakingEngine = new MatchmakingEngine(ioServer, queuePollingTimeMs);
matchmakingEngine.start();
