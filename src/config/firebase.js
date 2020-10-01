require('dotenv').config();
var admin = require("firebase-admin");
var privatekey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
console.log(privatekey);
var serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": privatekey,
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:process.env.FIREBASE_STORAGE_BUCKET
});

module.exports =admin;