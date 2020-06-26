"use strict";

const { firestore } = require("firebase-admin");

const collections = {
  LEARNING_AGREEMENT: "learningAgreement",
  USER: "user",
  UNIVERSITY: "university",
  COURSE: "course",
};

const getUserById = async (id) => {
  return _getDocumentById(collections.USER, id);
};

const getCourseById = async (id) => {
  return _getDocumentById(collections.COURSE, id);
};

const getUniversityById = async (id) => {
  return _getDocumentById(collections.UNIVERSITY, id);
};

const getLearningAgreementById = async (id) => {
  return _getDocumentById(collections.LEARNING_AGREEMENT, id);
};

const setLearningAgreementStatus = async (id, status) => {
  const db = firestore();
  try {
    await db
      .collection(collections.LEARNING_AGREEMENT)
      .doc(id)
      .update({ approved: status, lastEvaluatedOn: firestore.FieldValue.serverTimestamp() });
  } catch (err) {
    console.error(err);
  }
};

const _getDocumentById = async (collection, id) => {
  const db = firestore();
  try {
    const course = await db.collection(collection).doc(id).get();
    if (!course.exists) {
      return null;
    }
    return course.data();
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = {
  getCourseById,
  getUniversityById,
  getUserById,
  getLearningAgreementById,
  setLearningAgreementStatus,
};
