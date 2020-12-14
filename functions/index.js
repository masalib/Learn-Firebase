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

//mail送信API
const sendgrid  = require('@sendgrid/mail')
exports.sendMail = functions.https.onRequest(async (request, response) => {
    functions.logger.info("sendMail start");

    const apiKey = functions.config().sendgrid_service.key;
    const fromEmail = functions.config().sendgrid_service.email;
    const fromName = functions.config().sendgrid_service.name;

    sendgrid.setApiKey(apiKey);
    const msg = {
        to: "m-hirano@mediaseek.co.jp",
        from: `${fromName} <${fromEmail}>`,
        subject: `【${fromName}】問い合わせ受理メール`,
        text: `XXXX様
問い合わせありがとうございます。担当者が確認して返信したいと思いますので
少々お待ち下さい。

このメールには返信できません。`
    };

    sendgrid.send(msg).then((result )=>{
        functions.logger.info("sendMail success");
        response.send("sendMail success");
        return console.log("Successfully sent message:", result);
    })
    .catch((error)=>{
        functions.logger.error("sendMail error");
        functions.logger.error(error);
        response.send("sendMail error");
        return console.log("Error sending message:", error);
    })
    //return;
})
//webhook-url-in-slack
const { IncomingWebhook } = require('@slack/webhook');
exports.webhookslack = functions.https.onRequest(async (request, response) => {
    functions.logger.info("webhookslack start");
    const webhook = new IncomingWebhook(functions.config().slack_service.adminurl);
    const testId = 'test0001';
    const postId = 'post0001';
    const commentName = 'masalib';
    const array = [
        `新しいコメントが届きました！`,
        `<https://xxxxx.jp/jump?id=${testId}&post=${postId}|こちらから飛ぶ>`,
        `名前: ${commentName}`
    ]

    // slack APIが受け取れるオブジェクトを作成する
    const data = {
        text: array.join('\n'), // 配列を`\n`で結合、改行する
        username: 'FirebaseApp-BOT',
        icon_emoji: ':ghost:'
    }

    await webhook.send(data);
    response.send("webhookslack success");
    return;
})
