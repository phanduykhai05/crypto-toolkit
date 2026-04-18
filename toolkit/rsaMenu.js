const prompt = require("prompt-sync")();


const {
  generateRSAKeyPair,
  saveRSAKeys,
  encryptRSA,
  decryptRSA,
  readKeyFromFile,
} = require("./asymmetric");

async function copyToClipboard(text) {
  const clipboardy = await import("clipboardy");
  clipboardy.default.writeSync(text);
}
// UX Flow Helper
function copyOrTryAgain(result) {
  console.log("\n=====================================");
  console.log("1. Copy Result");
  console.log("2. Try Again");
  console.log("0. Back to Main Menu");
  console.log("=====================================");

  const option = prompt("Choose: ");

  if (option === "1") {
    copyToClipboard(result)
      .then(() => console.log("\n✅ Result copied to clipboard!"))
      .catch((err) => console.log("\n❌ Clipboard error:", err.message));
    return true;
  }

  if (option === "2") {
    return true;
  }

  return false;
}

// RSA MENU
function rsaMenu() {
  while (true) {
    console.log("\n=====================================");
    console.log("      ASYMMETRIC ENCRYPTION (RSA)");
    console.log("=====================================");
    console.log("1. Generate RSA Key Pair");
    console.log("2. Encrypt (Plaintext -> Ciphertext)");
    console.log("3. Decrypt (Ciphertext -> Plaintext)");
    console.log("0. Back");
    console.log("=====================================");

    const choice = prompt("Select RSA function: ");

    // Generate Key Pair
    if (choice === "1") {
      const { publicKey, privateKey } = generateRSAKeyPair();
      saveRSAKeys(publicKey, privateKey);

      console.log("\n✅ RSA Key Pair Generated Successfully!");
      console.log("\n--- PUBLIC KEY ---\n" + publicKey);
      console.log("\n--- PRIVATE KEY ---\n" + privateKey);

      console.log("\n📌 Keys saved into: public.pem & private.pem");
    }

    // Encrypt
    else if (choice === "2") {
      console.log("\n--- RSA ENCRYPTION ---");

      const plaintext = prompt("Enter Plaintext: ");

      console.log("\nEncryption Type:");
      console.log("1. Encrypt with Public Key (recommended)");
      console.log("2. Encrypt with Private Key (lab/demo)");
      const encryptType = prompt("Choose encryption type: ");

      console.log("\nKey Management:");
      console.log("1. Use key from .pem file");
      console.log("2. Enter key manually");

      const keyOption = prompt("Choose option: ");

      let key = "";
      let keyType = "public";

      try {
        if (encryptType === "1") {
          keyType = "public";
        } else if (encryptType === "2") {
          keyType = "private";
        } else {
          console.log("❌ Invalid encryption type!");
          continue;
        }

        if (keyOption === "1") {
          key = readKeyFromFile(keyType === "public" ? "public.pem" : "private.pem");
        } else if (keyOption === "2") {
          console.log(`\nPaste your ${keyType.toUpperCase()} KEY (end with ENTER):`);
          key = prompt("> ");
        } else {
          console.log("❌ Invalid option!");
          continue;
        }

        const ciphertext = encryptRSA(plaintext, key, keyType);

        console.log("\n=====================================");
        console.log("🔐 Ciphertext (Base64 Output):");
        console.log(ciphertext);
        console.log("=====================================");

        while (copyOrTryAgain(ciphertext)) {
          break;
        }

      } catch (err) {
        console.log("\n❌ Error:", err.message);
      }
    }

    // Decrypt
    else if (choice === "3") {
      console.log("\n--- RSA DECRYPTION ---");

      const ciphertext = prompt("Enter Ciphertext (Base64): ");

      console.log("\nDecryption Type:");
      console.log("1. Decrypt with Private Key (for public-encrypted text)");
      console.log("2. Decrypt with Public Key (for private-encrypted text)");
      const decryptType = prompt("Choose decryption type: ");

      console.log("\nKey Management:");
      console.log("1. Use key from .pem file");
      console.log("2. Enter key manually");

      const keyOption = prompt("Choose option: ");

      let key = "";
      let keyType = "private";

      try {
        if (decryptType === "1") {
          keyType = "private";
        } else if (decryptType === "2") {
          keyType = "public";
        } else {
          console.log("❌ Invalid decryption type!");
          continue;
        }

        if (keyOption === "1") {
          key = readKeyFromFile(keyType === "private" ? "private.pem" : "public.pem");
        } else if (keyOption === "2") {
          console.log(`\nPaste your ${keyType.toUpperCase()} KEY (end with ENTER):`);
          key = prompt("> ");
        } else {
          console.log("❌ Invalid option!");
          continue;
        }

        const plaintext = decryptRSA(ciphertext, key, keyType);

        console.log("\n=====================================");
        console.log("🔓 Plaintext Output:");
        console.log(plaintext);
        console.log("=====================================");

        while (copyOrTryAgain(plaintext)) {
          break;
        }

      } catch (err) {
        console.log("\n❌ Error:", err.message);
      }
    }

    // Back
    else if (choice === "0") {
      break;
    }

    // Invalid
    else {
      console.log("\n❌ Invalid choice. Try again!");
    }
  }
}

module.exports = { rsaMenu };