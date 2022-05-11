
require('dotenv').config({path:'../.env'});
const mongoose = require('mongoose');

const fs = require('fs');
const http = require('http');                 
const https = require('https'); 

const express = require('express');
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
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(URI)
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



