const firebase = require("firebase");
const {Timestamp} = firebase.firestore;
const account = require("../account.json");
const {isDev} = require('./config');

let db;
async function connectToFirebase() {
  console.log("connecting to database...");
  const app = firebase.initializeApp(account.app);
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
  const now = Timestamp.now();
  const data = {
    balance: -amount,
    lastUsed: now,
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
  const log = db.collection(`logs`).doc();
  log.set({
    timeStamp: now,
    account: account,
    amount: amount
  }).catch(console.error);

  return data.balance;
}

async function mockPay(cardNumber, amount) {
  return 2*amount;
}

module.exports = {pay};
if(isDev) {
  module.exports.pay = mockPay;
}
