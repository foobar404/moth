const functions = require('firebase-functions');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');


admin.initializeApp();


exports.generateKey = functions.https.onCall(async (data, context) => {
    if (data.key != "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYXVzdGludGhlbWljaGF1ZEBnbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjIsIm1vbnRoc1ZhbGlkIjoxMDAwMDAwMCwicHJvIjp0cnVlfQ.t2zfuJGZgngcyZYcAhqrtkll30NNNJiYsx_ZKTXU7kE") {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid key.');
    }

    // Data validation
    if (!data.monthsValid || !data.pro || !data.user) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required field.');
    }

    // Generate JWT
    // Note: In a real-world application, ensure your secret is securely stored and not hard-coded
    const secret = '%2Y3ypZURpcV9s';
    const iat = Math.floor(Date.now() / 1000);
    const token = jwt.sign({
        iat: iat,
        monthsValid: data.monthsValid,
        pro: data.pro,
        user: data.user
    }, secret);

    // Store JWT in Firestore
    const db = admin.firestore();
    await db.collection('beta-keys').doc(token).set({
        iat: iat,
        monthsValid: data.monthsValid,
        pro: data.pro,
        user: data.user
    });

    return { token };
});
