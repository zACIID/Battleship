import * as dotenv from "dotenv";
import * as http from "http";
import express from "express";
import {Express} from "express";
import cors from "cors";
import * as io from "socket.io";
import * as mongoose from "mongoose";


dotenv.config({path:'../.env'});

const app: Express = express();
const DB_URI: string = process.env.URI;

let io_server: io.Server = null;

console.log("demanding the sauce...");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(URI)
.then(()=>{
    console.log("Sauce received!");
    
    const server: http.Server = http.createServer(app);

    io_server = new io.Server(server);
    io_server.on('connection', function (client) {
        console.log("Socket.io client connected");
    });

    server.listen(8080, () => console.log("HTTP Server started on port 8080"));
})
.catch(
    (err) => {
      console.log("Error Occurred during initialization" );
      console.log(err);
    }
);


// Creation of JWT middleware
//var auth = jwt( {secret: process.env.JWT_SECRET} );

app.use(cors());

// Middleware that handles errors
app.use( function(err,
                  req, res,
                  next) {
    console.log("Request error: " + JSON.stringify(err) );
    res.status( err.statusCode || 500 ).json( err );
});


// Middleware that will report any error 404 
app.use( (req,res,next) => {
    res.status(404).json({statusCode:404, error:true, errormessage: "Invalid endpoint"} );
})

app.get("/", (req, res) => {
    res.status(200).json( { api_version: "1.0"} );
});



