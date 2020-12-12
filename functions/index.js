const functions = require('firebase-functions');

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello World logs!", {structuredData: true});
    response.send("Hello World");
})