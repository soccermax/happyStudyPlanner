"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");
const app = express();
const serviceAccount = require("./credentials-firebase.json");
const { isLocalFireStore } = require("./util/helper");
const { importData } = require("./util/dataImport");

const learningAgreementHandler = require("./handler/learningAgreement");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors({ origin: true }));

//TODO: remove after testing
app.get("/testApprovedMail", async (req, res) => {
  await admin.firestore().collection("learningAgreement").doc("990b5be9-9d7d-424f-8e94-3a907b9d3449").update({
    approved: true,
  });
  res.send("done");
});

if (isLocalFireStore) {
  importData().catch(() => {
    process.exit(-1);
  });
}

// REST Handler
exports.api = functions.https.onRequest(app);

// Database Handler
exports.onLearningAgreementCreated = learningAgreementHandler.onCreateHandler;
exports.onLearningAgreementUpdated = learningAgreementHandler.onUpdateHandler;
