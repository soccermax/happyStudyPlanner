'use strict'

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const app = express();

admin.initializeApp();

app.use(cors({ origin: true }));

app.get("/example", (req, res) => {
    res.send(200);
});


exports.api = functions.https.onRequest(app);
