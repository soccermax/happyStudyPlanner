"use strict";

const { getUserById, getAllLearningAgreementsForUserDeep } = require("./retrieve");

const getAllUserRelatedData = async (userID) => {
  return {
    ...(await getUserById(userID)),
    learningAgreements: await getAllLearningAgreementsForUserDeep(userID),
  };
};

module.exports = {
  getAllUserRelatedData,
};
