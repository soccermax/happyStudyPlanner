const mockData = require("../data/mockData.json");
const admin = require("firebase-admin");

const importData = async () => {
  const db = admin.firestore();
  const dbPromises = [];
  try {
    Object.keys(mockData).forEach((collection) => {
      const currentCollection = mockData[collection];
      Object.keys(currentCollection).forEach((document) => {
        const currentDocument = currentCollection[document];
        if (currentDocument.lastEvaluatedOn) {
          if (currentDocument.lastEvaluatedOn === "NEVER") {
            currentDocument.lastEvaluatedOn = null;
          } else if (currentDocument.lastEvaluatedOn === "YESTERDAY") {
            let date = new Date();
            date.setDate(date.getDate() - 1);
            currentDocument.lastEvaluatedOn = admin.firestore.Timestamp.fromDate(date);
          } else {
            currentDocument.lastEvaluatedOn = admin.firestore.Timestamp.fromDate(new Date());
          }
        }
        if (currentDocument.lastModifiedOn) {
          if (currentDocument.lastModifiedOn === "NEVER") {
            currentDocument.lastModifiedOn = null;
          } else if(currentDocument.lastModifiedOn === "TODAY") {
            currentDocument.lastModifiedOn = admin.firestore.Timestamp.fromDate(new Date());
          }
        }
        dbPromises.push(db.collection(collection).doc(document).set(currentCollection[document]));
      });
    });
    await Promise.all(dbPromises);
    console.log("Import finished");
  } catch (err) {
    console.error("Import Failed");
    throw new Error(err);
  }
};

module.exports = {
  importData,
};
