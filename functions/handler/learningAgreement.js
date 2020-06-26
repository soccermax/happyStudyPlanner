"use strict";

const functions = require("firebase-functions");
const { getUserById, getLearningAgreementById } = require("../util/retrieve");
const { sendLearningAgreementApproved } = require("../mail-service/client");

const functionRegion = "europe-west3";

const onCreateHandler = functions
  .region(functionRegion)
  .firestore.document("learningAgreement/{learningAgreementId}")
  .onCreate(async (snapshot, context) => {
    // Notification Alexa Skill
    // const itemDataSnap = await snapshot.ref.get();
  });

const onUpdateHandler = functions
  .region(functionRegion)
  .firestore.document("learningAgreement/{learningAgreementId}")
  .onUpdate(async (snapshot) => {
    const afterUpdate = snapshot.after.data();
    if (Object.prototype.hasOwnProperty.call(afterUpdate, "approved") && afterUpdate.approved === true) {
      return _sendLearningAgreementApprovedEmail(await getLearningAgreementById(snapshot.after.id));
    } else {
      return Promise.resolve();
    }
  });

const _sendLearningAgreementApprovedEmail = async (learningAgreement) => {
  const student = await getUserById(learningAgreement.student);
  return sendLearningAgreementApproved(student.email, {
    name: student.preName,
  });
};

module.exports = {
  onCreateHandler,
  onUpdateHandler,
};
