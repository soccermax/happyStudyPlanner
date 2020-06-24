const admin = require("firebase-admin");



const onCreateHandler = functions.firestore
    .document("learningAgreement/{learningAgreementId}")
    .onCreate(async (snapshot, context) => {
        const itemDataSnap = await snapshot.ref.get();
        console.log(itemDataSnap.data());
        return admin
            .firestore()
            .collection("mail")
            .add({
                to: ["max.grunfelder@gmail.com"],
                message: {
                    subject: "Your reservation is here !",
                    html: "Hey This is your reservation for the event and it costs, thanks for the purchase.",
                },
            })
            .then(() => console.log("Queued email for delivery!"));
    });



module.exports = {
    onCreateHandler
}