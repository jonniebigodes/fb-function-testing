const adminSdk= require('firebase-admin');

const serviceAccount= require('../firebasesettings.json');

adminSdk.initializeApp({credential:adminSdk.credential.cert(serviceAccount)})

const db= adminSdk.firestore()

module.exports={adminSdk,db}