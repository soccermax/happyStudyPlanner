"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");
const app = express();
const serviceAccount = require("./credentials-firebase.json");

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

exports.api = functions.https.onRequest(app);
exports.onItemCreation = functions.firestore
  .document("learningAgreement/{learningAgreementId}")
  .onCreate(async (snapshot, context) => {
    const itemDataSnap = await snapshot.ref.get();
    console.log(itemDataSnap.data());
    return admin
      .firestore()
      .collection("mail")
      .add({
        to: ["max.grunfelder@gmail.com"],
        message: {
          subject: "Your reservation is here !",
          html: "Hey This is your reservation for the event and it costs, thanks for the purchase.",
        },
      })
      .then(() => console.log("Queued email for delivery!"));
  });
