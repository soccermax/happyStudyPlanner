'use strict'

const admin = require('firebase-admin');
const serviceAccount = require('../credentials-firebase.json');
const importData = require("../data/mockData.json");


(async() => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    const db = admin.firestore();
    const dbPromises = [];

    try {
        Object.keys(importData).forEach(collection => {
            const currentCollection = importData[collection];
            Object.keys(currentCollection).forEach(document => {
                const currentDocument = currentCollection[document];
                if (currentDocument.lastEvaluationDate) {
                    if (currentDocument.lastEvaluationDate == "NEW") {
                        currentDocument.lastEvaluationDate = admin.firestore.Timestamp.fromDate(new Date('01.01.1970'));
                    } else {
                        currentDocument.lastEvaluationDate = admin.firestore.Timestamp.fromDate(new Date());
                    }
                }
                dbPromises.push(db.collection(collection).doc(document).set(currentCollection[document]));
            })
        });
        await Promise.all(dbPromises);
        console.log("Import finished");
        process.exit();
    } catch(err) {
        console.error(err);
        process.exit(-1);
    }


})();