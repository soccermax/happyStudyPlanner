const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");
const {
  getAllLearningAgreementsForUserDeep,
  getLearningAgreementById,
  saveCommentsForLearningAgreement,
  setLearningAgreementStatus,
} = require("../util/retrieve");
const { generatePDFSteam } = require("../learning-agreement");
const { getFileStream } = require("../util/attachments");

const api = express();

const functionRegion = "europe-west3";

api.use(cors({ origin: true }));

api.get("/learningAgreement/:id/file", async (req, res) => {
  const { id } = req.params;
  if (!id || id.length === 0) {
    return res.status(400).send("The provided id is not a valid learning agreement ID");
  }
  const stream = await generatePDFSteam(id);
  return stream.pipe(res);
});

api.get("/userData/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId || userId.length === 0) {
    return res.status(400).send("The provided id is not a valid user ID");
  }
  return res.send(await getAllLearningAgreementsForUserDeep(userId));
});

api.get("/module/:moduleId/file", async (req, res) => {
  const { moduleId } = req.params;
  if (!moduleId || moduleId.length === 0) {
    return res.status(400).send("The provided id is not a valid user ID");
  }
  return getFileStream(moduleId).pipe(res);
});

api.get("/learningAgreement/:learningAgreementId", async (req, res) => {
  const { learningAgreementId } = req.params;
  if (!learningAgreementId || learningAgreementId.length === 0) {
    return res.status(400).send("The provided id is not a valid learningAgreement ID");
  }
  return res.send(await getLearningAgreementById(learningAgreementId, true));
});

api.post("/learningAgreement/:learningAgreementId/comments/", async (req, res) => {
  const { learningAgreementId } = req.params;
  if (!learningAgreementId || learningAgreementId.length === 0) {
    return res.status(400).send("The provided id is not a valid learningAgreement ID");
  }
  if (req.body === undefined || req.body === null) {
    return res.status(400).send("Comments are missing");
  }
  await saveCommentsForLearningAgreement(learningAgreementId, req.body);
  return res.sendStatus(200);
});

api.put("/learningAgreement/:learningAgreementId/approved/", async (req, res) => {
  const { learningAgreementId } = req.params;
  const { status } = req.query;
  if (!learningAgreementId || learningAgreementId.length === 0) {
    return res.status(400).send("The provided id is not a valid learningAgreement ID");
  }
  if (!status) {
    return res.status(400).send("Learning Agreement Status is required: true|falsee");
  }
  await setLearningAgreementStatus(learningAgreementId, status);
  return res.sendStatus(204);
});

module.exports = {
  api: functions.region(functionRegion).https.onRequest(api),
};
