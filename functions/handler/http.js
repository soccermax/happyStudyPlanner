const functions = require("firebase-functions");
const { isUuid } = require("uuidv4");
const cors = require("cors");
const express = require("express");
const { getAllLearningAgreementsForUserDeep } = require("../util/retrieve");

const api = express();

const functionRegion = "europe-west3";

api.use(cors({ origin: true }));

//TODO: remove after testing
api.get("/testApprovedMail", async (req, res) => {
  await admin.firestore().collection("learningAgreement").doc("990b5be9-9d7d-424f-8e94-3a907b9d3449").update({
    approved: true,
  });
  res.send("done");
});

api.get("/userData/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!isUuid(userId)) {
    res.status(400).send("The provided UserId is not a valid user ID");
  }
  return res.send(await getAllLearningAgreementsForUserDeep(userId));
});

module.exports = {
  api: functions.region(functionRegion).https.onRequest(api),
};
