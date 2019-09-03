const firebase = require("firebase");
const {Timestamp} = firebase.firestore;
const account = require("../account.json");

let db;
async function connectToFirebase() {
  const app = firebase.initializeApp({
    apiKey: "AIzaSyAwa0joU0ahF4vlS3eGFdrJ2M2EG_AL4Uw",
    authDomain: "make-zkk-white-again.firebaseapp.com",
    databaseURL: "https://make-zkk-white-again.firebaseio.com",
    projectId: "make-zkk-white-again",
    storageBucket: "make-zkk-white-again.appspot.com",
    messagingSenderId: "47546004376",
    appId: "1:47546004376:web:da05c646fcb11891"
  });
  await firebase.auth().signInWithEmailAndPassword(account.email, account.password);
  db = app.firestore();
  console.log("connected to database")
}

async function pay(cardNumber, amount) {
  if(!db) {
    await connectToFirebase();
  }
  const card = db.collection(`cards`).doc(`${cardNumber}`);
  const cardSnapshot = await card.get();
  const data = {
    balance: -amount,
    lastUsed: Timestamp.now(),
    phone: "",
  };

  let account;
  if(cardSnapshot.exists) {
    account = cardSnapshot.data().account;
    const accountSnapshot = await account.get();
    if(accountSnapshot.exists) {
      data.balance += accountSnapshot.data().data.balance;
      data.phone = accountSnapshot.data().data.phone || data.phone;
    }
  } else {
    account = db.collection(`accounts`).doc();
    await card.set({account})
  }

  await account.set({data});
  return data.balance;
}

module.exports = {pay};
