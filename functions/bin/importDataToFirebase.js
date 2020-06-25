"use strict";

const admin = require("firebase-admin");
const serviceAccount = require("../credentials-firebase.json");
const { importData } = require("../util/dataImport");


(async () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  try {
    await importData();
  }
  catch (err) {
    console.error(err);
    process.exit(-1);
  }
})();
