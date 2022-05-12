/* TODO come li facciamo gli import?
*   1. import {qualcosa} from "modulo"
*   2. const modulo = require("modulo")
*
*   Perché usare il primo: (è quello che usa il prof credo) il punto principale
*   è che così funziona il type hinting di typescript.
*   Inoltre, in teoria, alcuni campi di tsconfig.json possono essere settati
*   per generare moduli commonJs supportati da Node.
*   Dunque, in teoria, quando il file typescript viene compilato, gli import vengono sostituiti da require.
*   Per esempio, nel tutorial seguente (per creare un tsconfig.json adatto a Node)
*   viene importato express usando questo stile:
*   https://blog.logrocket.com/how-to-set-up-node-typescript-express/#generating-tsconfig-json
*
*   Perché usare il secondo: perché su node è standard usare const x = require("x")
*   Quindi, se è vero che typescript compila automaticamente gli import {x} from "x",
*   allora require diventa scomodo e basta
*
*   L'importante è comunque mettersi d'accordo sull'usare solo uno stile di import,
*   perché metterne due insieme rompe tutto
*
*/

import exp = require("constants");

require('dotenv').config({path:'../.env'});
const mongoose = require('mongoose');

const fs = require('fs');
const http = require('http');                 
const https = require('https'); 

import * as express from "express";
const bodyparser = require('body-parser'); 

let ios = undefined;
const app = express();

const passport = require('passport');           
const passportHTTP = require('passport-http');  

const jsonwebtoken = require('jsonwebtoken');  
const jwt = require('express-jwt');

const cors = require('cors');                  
const io = require('socket.io');



const URI = process.env.URI;

console.log("demanding the sauce...");
connect(URI)
.then(()=>{
    
    console.log("Sauce received!");
    
    let server = http.createServer(app);

    ios = io(server);
    ios.on('connection', function (client) {
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


app.use('/match', require('./routes/match-routes'))
app.use('/user/:userId/chats', require('./routes/chat-routes'))
app.use('/user', require('./routes/user-routes'))


// Creation of JWT middleware
//var auth = jwt( {secret: process.env.JWT_SECRET} );

app.use( cors() );

// Middleware that handle errors
app.use( function(err, req, res, next) {

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



