import * as dotenv from 'dotenv';
import * as http from 'http';
import express, {Express, NextFunction} from 'express';
import cors from 'cors';
import * as io from 'socket.io';
import * as mongoose from 'mongoose';

dotenv.config({path: '../.env'});

const app: Express = express();
const DB_URI: string = process.env.DB_URI;

let io_server: io.Server = null;


/* Database Connection */
console.log('demanding the sauce...');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Sauce received!');

    const server: http.Server = http.createServer(app);

    io_server = new io.Server(server);
    io_server.on('connection', function (client) {
      console.log('Socket.io client connected');
    });

    server.listen(8080, () => console.log('HTTP Server started on port 8080'));
  })
  .catch((err) => {
    console.log('Error Occurred during initialization');
    console.log(err);
  });



/* Creation of JWT middleware */
//var auth = jwt( {secret: process.env.JWT_SECRET} );


/* Allows server to respond to a particular request that asks which request options it accept */
app.use(cors());


/* Alternative to bodyparser which is deprecated */
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads



