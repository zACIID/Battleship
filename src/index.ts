import * as dotenv from 'dotenv';
import * as path from 'path';
import * as http from 'http';
import { inspect } from "util";

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as io from 'socket.io';
import mongoose = require('mongoose');
import filter = require('content-filter');
import chalk from 'chalk';

import { router as authRouter } from './routes/auth-routes';
import { router as userRouter } from './routes/user-routes';
import { router as chatRouter } from './routes/chat-routes';
import { router as matchRouter } from './routes/match-routes';
import { router as leaderboardRouter } from './routes/leaderboard-routes';
import { router as relationshipRouter } from './routes/relationship-routes';
import { router as notificationRouter } from './routes/notification-routes';
import { router as roleRouter } from './routes/role-routes';
import { router as moderatorRouter } from './routes/moderator-routes';
import bodyParser from "body-parser";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Express = express();

// If testing, set test db uri, else use the other
const isTesting: boolean = process.env.TEST === 'true';
const dbUri: string = isTesting ? process.env.TEST_DB_URI : process.env.DB_URI;
const serverPort: number = parseInt(process.env.PORT, 10);

let ioServer: io.Server = null;

/* Database Connection */
console.log('demanding the sauce...');
mongoose
    .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Sauce received!');

        const server: http.Server = http.createServer(app);

        ioServer = new io.Server(server);
        ioServer.on('connection', function (client) {
            console.log('Socket.io client connected');
        });

        server.listen(serverPort, () => console.log(`HTTP Server started on port ${serverPort}`));

        // Logging functionality to understand what requests arrive to the server
        server.addListener('request', (req: Request, res: Response) => {
            console.log(chalk.magenta.bold(`Request received: ${req.method} ${req.url}`));

            // inspect replaces circular references in the json with [Circular]
            console.log(chalk.yellow(inspect(req.body)));
        });
    })
    .catch((err) => {
        console.log('Error Occurred during initialization');
        console.log(err);
    });

/* Creation of JWT middleware */
//var auth = jwt( {secret: process.env.JWT_SECRET} );

/* Allows server to respond to a particular request that asks which request options it accepts */
app.use(cors());

/* Alternative to bodyparser which is deprecated */
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// Allow cross-origin
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

/* Sanitize input to avoid NoSQL injections */
app.use(filter({ methodList: ['GET', 'POST', 'PATCH', 'DELETE'] }));

/* Register endpoints */
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', chatRouter);
app.use('/api', matchRouter);
app.use('/api', roleRouter);
app.use('/api', notificationRouter);
app.use('/api', relationshipRouter);
app.use('/api', moderatorRouter);
app.use('/api', leaderboardRouter);
