const admin = require("firebase-admin");

function getFileStream(moduleId) {
  const bucket = admin.storage().bucket("gs://happystudyplanner.appspot.com");
  return bucket.file(moduleId).createReadStream();
}

module.exports = {
  getFileStream,
};
