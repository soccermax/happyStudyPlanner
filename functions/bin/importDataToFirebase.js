"use strict";

const admin = require("firebase-admin");
const serviceAccount = require("../credentials-firebase.json");
const importData = require("../data/mockData.json");

(async () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const db = admin.firestore();
  const dbPromises = [];

  try {
    Object.keys(importData).forEach((collection) => {
      const currentCollection = importData[collection];
      Object.keys(currentCollection).forEach((document) => {
        const currentDocument = currentCollection[document];
        if (currentDocument.lastEvaluatedOn) {
          if (currentDocument.lastEvaluatedOn === "NEVER") {
            currentDocument.lastEvaluatedOn = admin.firestore.Timestamp.fromDate(
              new Date("01.01.1970")
            );
          } else if(currentDocument.lastEvaluatedOn === "YESTERDAY") {
              let date = new Date();
              date.setDate(date.getDate() -1 )
            currentDocument.lastEvaluatedOn = admin.firestore.Timestamp.fromDate(
               date
              );
          } 
          else {
            currentDocument.lastEvaluatedOn = admin.firestore.Timestamp.fromDate(
              new Date()
            );
          }
        }
        if (currentDocument.lastModifiedOn) {
            if (currentDocument.lastModifiedOn === "NEVER") {
              currentDocument.lastModifiedOn = admin.firestore.Timestamp.fromDate(
                new Date("01.01.1970")
              );
            } else {
              currentDocument.lastModifiedOn = admin.firestore.Timestamp.fromDate(
                new Date()
              );
            }
          }
        dbPromises.push(
          db
            .collection(collection)
            .doc(document)
            .set(currentCollection[document])
        );
      });
    });
    await Promise.all(dbPromises);
    console.log("Import finished");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
})();
