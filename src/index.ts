import fs from 'fs';
import http from'http';                  // HTTP module
import https from 'https';                // HTTPS module
import colors from 'colors';

colors.enabled = true;

import mongoose from 'mongoose';
import mongo from 'mongodb';



import express from 'express';
import bodyparser from 'body-parser';      // body-parser middleware is used to parse the request body and
                                                 // directly provide a JavaScript object if the "Content-type" is
                                                 // application/json

import passport from 'passport';           // authentication middleware for Express
import passportHTTP from 'passport-http';  // implements Basic and Digest authentication for HTTP (used for /login endpoint)

import jsonwebtoken from 'jsonwebtoken';  // JWT generation
import jwt from 'express-jwt';            // JWT parsing middleware for express

import cors from 'cors';                  // Enable CORS middleware
import io from 'socket.io';               // Socket.io websocket library
import { nextTick } from 'process';

const user = {username: "admin", password: "sauceRealHard"} // this needs to be hidden

const dbname = "BattleShips"

const uri = "mongodb+srv://" + user.username + ":" + user.password + "@cluster0.dzbb4.mongodb.net/" + dbname + "?retryWrites=true&w=majority"

const MongoClient = mongo.MongoClient

async function run(){

    const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        console.log("demanding the sauce...")

        await client.connect();
        
        console.log("sauce received!")

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

run().catch(console.error);

