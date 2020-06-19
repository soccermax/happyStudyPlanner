'use strict'

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const app = express();

const { requestOAuthAccessToken, triggerNotification } = require("./src/alexa-skill");

//Router files
// const userRouter = require("./router/user");
// const testResultRouter = require("./router/testResult");

admin.initializeApp();

app.use(cors({ origin: true }));

app.get("/test", async (req, res) => {
    // try {
    //     await triggerNotification(undefined, await requestOAuthAccessToken())
    //     res.send(200);
    // } catch(err) {
    //     console.log("error happened")
    //     console.error(err);
    //     console.error(err.data);
    //     res.send(err);
    // }
})

// app.use("/user", userRouter);
// app.use("/testResult", testResultRouter);

exports.api = functions.https.onRequest(app);
