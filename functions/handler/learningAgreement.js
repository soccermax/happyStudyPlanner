"use strict";

const functions = require("firebase-functions");
const { getUserById, getLearningAgreementById } = require("../util/retrieve");
const { sendLearningAgreementApproved, sendLearningAgreementRejected } = require("../mail-service");
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
    if (Object.prototype.hasOwnProperty.call(afterUpdate, "approved") && afterUpdate.approved === "true") {
      return getImportRunningState()
        ? Promise.resolve()
        : _sendLearningAgreementApprovedEmail(
            snapshot.after.id,
            await getLearningAgreementById(snapshot.after.id, true)
          );
    } else if (
      Object.prototype.hasOwnProperty.call(afterUpdate, "approved") &&
      afterUpdate.approved === "false" &&
      Object.prototype.hasOwnProperty.call(afterUpdate, "lastEvaluatedOn") &&
      afterUpdate.lastEvaluatedOn !== null
    ) {
      return getImportRunningState()
        ? Promise.resolve()
        : _sendLearningAgreementRejectedEmail(
            snapshot.after.id,
            await getLearningAgreementById(snapshot.after.id, true)
          );
    } else {
      return Promise.resolve();
    }
  });

const _sendLearningAgreementApprovedEmail = async (id, learningAgreement) => {
  return sendLearningAgreementApproved(
    learningAgreement.student.email,
    {
      preName: learningAgreement.student.preName,
      name: learningAgreement.student.name,
      partnerUniversityName: learningAgreement.targetUniversity.name,
      learningAgreementURL: `https://europe-west3-happystudyplanner.cloudfunctions.net/api/learningAgreement/${id}/file`,
    },
    { learningAgreementID: id }
  );
};

const _sendLearningAgreementRejectedEmail = async (id, learningAgreement) => {
  const student = await getUserById(learningAgreement.student.id);
  return sendLearningAgreementRejected(
    student.email,
    {
      preName: student.preName,
      name: student.name,
      partnerUniversityName: learningAgreement.targetUniversity.name,
      REPEATED_LIST_OF_COURSES: learningAgreement.courses.map((course) => {
        return {
          courseHomeUniversityName: course.courseHomeUniversity.name,
          courseHomeUniversityCreditPoints: course.courseHomeUniversity.creditPoints,
          courseTargetUniversityName: course.courseTargetUniversity.name,
          courseTargetUniversityCreditPoints: course.courseTargetUniversity.creditPoints,
          comment: course.comment,
        };
      }),
    },
    { learningAgreementID: id }
  );
};

module.exports = {
  onCreateHandler,
  onUpdateHandler,
};
