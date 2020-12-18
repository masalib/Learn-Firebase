const functions = require('firebase-functions');

export const helloWorld3 = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello World logs!", {structuredData: true});
    response.send("Hello World3");
})
