"use strict"

const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { getUserById, getLearningAgreementById } = require("../util/retrieve");
const { sendLearningAgreementApproved } = require("../mail-service/client");


const onCreateHandler = functions.firestore
    .document("learningAgreement/{learningAgreementId}")
    .onCreate(async (snapshot, context) => {
        // Notification Alexa Skill
        const itemDataSnap = await snapshot.ref.get();
        console.log(itemDataSnap.data());
    });

    const onUpdateHandler = functions.firestore
    .document("learningAgreement/{learningAgreementId}")
    .onUpdate(async (snapshot, context) => {
        const beforeUpdate = snapshot.before.data();
        const afterUpdate = snapshot.after.data();
        console.log(beforeUpdate.approved);
        console.log(afterUpdate.approved);
        if ( Object.prototype.hasOwnProperty.call(afterUpdate, "approved") && afterUpdate.approved === true) {
            return _sendLearningAgreementApprovedEmail(await getLearningAgreementById(snapshot.after.id));
        }
    });    


const _sendLearningAgreementApprovedEmail = async(learningAgreement) => {
    console.log(learningAgreement);
    const student = await getUserById(learningAgreement.student);
    return sendLearningAgreementApproved(student.email, {
        name: student.preName
    });
}



module.exports = {
    onCreateHandler,
    onUpdateHandler
}