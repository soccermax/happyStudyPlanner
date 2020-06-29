const mockData = require("../data/mockData.json");
const admin = require("firebase-admin");
const { generateFirestoreDocumentID } = require("./helper");
let idMap = {};

const importData = async () => {
  const db = admin.firestore();
  const dbPromises = [];
  try {
    Object.keys(mockData).forEach((collection) => {
      const currentCollection = mockData[collection];
      replaceKeyFieldsInCollectionAndDocuments(newIdMap(), mockData, currentCollection);
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
          } else {
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

const newIdMap = () => {
  const idMapFunction = (id) => {
    if (Object.prototype.hasOwnProperty.call(idMap, id)) {
      return idMap[id];
    } else {
      idMap[id] = generateFirestoreDocumentID();
      return idMap[id];
    }
  };
  return idMapFunction;
};

const replaceKeyFieldsInCollectionAndDocuments = (idMap, mockData, currentCollection) => {
  Object.keys(currentCollection).forEach((document) => {
    if (checkIfKeyShouldBeReplaced(document)) {
      const newID = idMap(document);
      currentCollection[newID] = currentCollection[document];
      delete currentCollection[document];
      replaceDocumentDeep(idMap, currentCollection[newID]);
    } else {
      replaceDocumentDeep(idMap, currentCollection[document]);
    }
  });
};

const replaceDocumentDeep = (idMap, document) => {
  if (Array.isArray(document)) {
    document.forEach((element) => {
      replaceDocumentDeep(idMap, element);
    });
    return;
  }
  Object.keys(document).forEach((field) => {
    if (typeof document[field] === "object" && typeof document[field] !== null) {
      // eslint-disable-line valid-typeof
      return replaceDocumentDeep(idMap, document[field]);
    }
    if (checkIfKeyShouldBeReplaced(document[field])) {
      document[field] = idMap(document[field]);
    }
  });
};

const checkIfKeyShouldBeReplaced = (key) => {
  return key !== null && typeof key === "string" && key.startsWith("id_");
};

module.exports = {
  importData,
};
