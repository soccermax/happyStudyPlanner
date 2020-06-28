"use strict";

const functions = require("firebase-functions");
const { getUserById, getLearningAgreementById } = require("../util/retrieve");
const { sendLearningAgreementApproved } = require("../mail-service");
const { triggerNotification } = require("../alexa-skill");
const { getImportRunningState } = require("../util/helper");

const functionRegion = "europe-west3";

const onCreateHandler = functions
  .region(functionRegion)
  .firestore.document("learningAgreement/{learningAgreementId}")
  .onCreate(async (snapshot) => {
    const learningAgreement = (await snapshot.ref.get()).data();
    return getImportRunningState() ? Promise.resolve() : triggerNotification(learningAgreement.student);
  });

const onUpdateHandler = functions
  .region(functionRegion)
  .firestore.document("learningAgreement/{learningAgreementId}")
  .onUpdate(async (snapshot) => {
    const afterUpdate = snapshot.after.data();
    if (Object.prototype.hasOwnProperty.call(afterUpdate, "approved") && afterUpdate.approved === true) {
      return getImportRunningState()
        ? Promise.resolve()
        : _sendLearningAgreementApprovedEmail(snapshot.after.id, await getLearningAgreementById(snapshot.after.id));
    } else {
      return Promise.resolve();
    }
  });

const _sendLearningAgreementApprovedEmail = async (id, learningAgreement) => {
  const student = await getUserById(learningAgreement.student);
  return sendLearningAgreementApproved(
    student.email,
    {
      name: student.preName,
    },
    { learningAgreementID: id }
  );
};

module.exports = {
  onCreateHandler,
  onUpdateHandler,
};
