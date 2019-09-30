const {connectToFirebase, getDB} = require("../src/bank");

async function main() {
  await connectToFirebase({quiet: true});
  const logs = await getDB().collection(`logs`).orderBy("timeStamp").get();
  console.log("TimeStamp\tAccount\tAmount");
  logs.forEach(log => {
    const {amount, timeStamp, account} = log.data();
    const time = timeStamp.toDate()
      .toLocaleString("sv-SV", { hour12: false })
      .replace(",", "");
    console.log([time, account.id, amount].join("\t"));
  });
  process.exit();
}

main();