"use strict";

const isLocalFireStore = process.env.NODE_ENV === "firestore";
const isLocalFunctions = process.env.NODE_ENV === "functions";
const isLocal = isLocalFireStore || isLocalFunctions;
let importRunningState = false;

module.exports = {
  isLocal,
  isLocalFireStore,
  isLocalFunctions,
  setImportRunningState: (value) => (importRunningState = value),
  getImportRunningState: () => importRunningState,
};
