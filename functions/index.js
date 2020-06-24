"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");
const app = express();
const serviceAccount = require("./credentials-firebase.json");

const learningAgreementHandler = require("./handler/learningAgreement");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors({ origin: true }));

app.get("/example", (req, res) => {
  res.send(200);
});

app.get("/testSendMail", async (req, res) => {
  await admin.firestore().collection("learningAgreement").add({
    score: "tset",
  });
  res.send("done");
});

// REST Handler
exports.api = functions.https.onRequest(app);

// Database Handler
exports.onLearningAgreementCreated = learningAgreementHandler
