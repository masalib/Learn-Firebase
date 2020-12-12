const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello World logs!", {structuredData: true});
    response.send("Hello World");
})

exports.helloWorld2 = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello2 World logs!", {structuredData: true});
    functions.logger.info("emulator test2");
    response.send("Hello World2");
})

exports.onCreateUser = functions.auth.user().onCreate(async(userRecord, _context) => {

    var email = userRecord.email ? userRecord.email : ""
    var photoURL = userRecord.photoURL ? userRecord.photoURL : ""
    var displayName = userRecord.displayName ? userRecord.displayName : ""

    var serverTimestamp = admin.firestore.FieldValue.serverTimestamp()

    functions.logger.info("user created", userRecord);
    await admin.firestore().collection('members').doc(userRecord.uid).set({
        docId: userRecord.uid,
        uid: userRecord.uid,
        email: email,
        displayName: displayName,
        photoURL: photoURL,
        departmentId: "9999",
        createdAt: serverTimestamp,
        updatedAt: serverTimestamp,
    });
    return;
});



