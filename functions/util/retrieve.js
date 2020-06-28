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

const getLearningAgreementById = async (id, deep = false) => {
  const learningAgreement = await _getDocumentById(collections.LEARNING_AGREEMENT, id);
  if (!deep) {
    return learningAgreement;
  }
  for (const course of learningAgreement.courses) {
    const [courseHomeUniversity, courseTargetUniversity] = await Promise.all([
      getCourseById(course.courseHomeUniversity),
      getCourseById(course.courseTargetUniversity),
    ]);
    course.courseHomeUniversity = courseHomeUniversity;
    course.courseTargetUniversity = courseTargetUniversity;
  }
  const [targetUniversity, responsible, student] = await Promise.all([
    getUniversityById(learningAgreement.targetUniversity),
    getUserById(learningAgreement.responsible),
    getUserById(learningAgreement.student)
  ]);
  learningAgreement.targetUniversity = targetUniversity;
  learningAgreement.responsible = responsible;
  learningAgreement.student = student;
  return learningAgreement;
};

const getAllLearningAgreementsForUserDeep = async (userID) => {
  const db = firestore();
  return Promise.all(
    (await db.collection(collections.LEARNING_AGREEMENT).where("student", "==", userID).get()).docs.map(
      async (document) => {
        const learningAgreement = document.data();

        delete learningAgreement.student;
        for (const course of learningAgreement.courses) {
          const [courseHomeUniversity, courseTargetUniversity] = await Promise.all([
            getCourseById(course.courseHomeUniversity),
            getCourseById(course.courseTargetUniversity),
          ]);
          course.courseHomeUniversity = courseHomeUniversity;
          course.courseTargetUniversity = courseTargetUniversity;
        }
        const [targetUniversity, responsible] = await Promise.all([
          getUniversityById(learningAgreement.targetUniversity),
          getUserById(learningAgreement.responsible),
        ]);
        learningAgreement.targetUniversity = targetUniversity.name;
        learningAgreement.responsible = `${responsible.preName} ${responsible.name}`;
        return learningAgreement;
      }
    )
  );
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
    const document = await db.collection(collection).doc(id).get();
    if (!document.exists) {
      return null;
    }
    return document.data();
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
  getAllLearningAgreementsForUserDeep,
};
