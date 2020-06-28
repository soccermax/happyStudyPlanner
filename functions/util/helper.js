"use strict";

const isLocalFireStore = process.env.NODE_ENV === "firestore";
const isLocalFunctions = process.env.NODE_ENV === "functions";
const isLocal = isLocalFireStore || isLocalFunctions;
let importRunningState = false;

const generateFirestoreDocumentID = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';
  while (autoId.length < 20) {
    const bytes = crypto_1.randomBytes(40);
    bytes.forEach(b => {
      const maxValue = 62 * 4 - 1;
      if (autoId.length < 20 && b <= maxValue) {
        autoId += chars.charAt(b % 62);
      }
    });
  }
  return autoId;
};

module.exports = {
  isLocal,
  isLocalFireStore,
  isLocalFunctions,
  setImportRunningState: (value) => (importRunningState = value),
  getImportRunningState: () => importRunningState,
  generateFirestoreDocumentID
};
