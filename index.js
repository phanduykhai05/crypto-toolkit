const prompt = require("prompt-sync")();
const { rsaMenu } = require("./toolkit/rsaMenu");

function mainMenu() {
  while (true) {
    console.log("\n=====================================");
    console.log("     CRYPTOGRAPHY TOOLKIT (CLI)");
    console.log("=====================================");
    console.log("1. Symmetric Encryption");
    console.log("2. Asymmetric Encryption (RSA)");
    console.log("3. Hash Functions");
    console.log("0. Exit");
    console.log("=====================================");

    const choice = prompt("Choose feature group: ");

    if (choice === "1") {
      console.log("\n[Symmetric Encryption] - Not implemented yet!");
    } 
    else if (choice === "2") {
      rsaMenu();
    } 
    else if (choice === "3") {
      console.log("\n[Hash Functions] - Not implemented yet!");
    } 
    else if (choice === "0") {
      console.log("\nExiting program...");
      break;
    } 
    else {
      console.log("\n❌ Invalid choice. Try again!");
    }
  }
}

mainMenu();