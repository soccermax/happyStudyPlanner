"use strict";

const admin = require("firebase-admin");

const serviceAccount = require("./credentials-firebase.json");
const { isLocalFireStore, setImportRunningState } = require("./util/helper");
const { importData } = require("./util/dataImport");

const learningAgreementHandler = require("./handler/learningAgreement");
const { api } = require("./handler/http");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

if (isLocalFireStore) {
  setImportRunningState(true);
  importData()
    .then(() => {
      return setTimeout(() => {
        setImportRunningState(false)
      }, 5000)
    })
    .catch(() => {
      process.exit(-1);
    });
}

// REST Handler
exports.api = api;

// Database Handler
exports.onLearningAgreementCreated = learningAgreementHandler.onCreateHandler;
exports.onLearningAgreementUpdated = learningAgreementHandler.onUpdateHandler;
