const functions = require('firebase-functions');
const express= require('express');
const {getAllTranscripts,addTranscripts}= require('./handlers/transcripts');
const app = express()

app.get('/transcripts',getAllTranscripts)
app.post('/transcript',addTranscripts)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.api= functions.region('europe-west1').https.onRequest(app)