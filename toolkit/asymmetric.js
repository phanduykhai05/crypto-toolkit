const crypto = require("crypto");
const fs = require("fs");

/**
 * Generate RSA Key Pair (2048 bits)
 * return { publicKey, privateKey }
 */
function generateRSAKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  return { publicKey, privateKey };
}

/**
 * Save RSA keys to file
 */
function saveRSAKeys(publicKey, privateKey) {
  fs.writeFileSync("public.pem", publicKey);
  fs.writeFileSync("private.pem", privateKey);
}

/**
 * Encrypt plaintext with RSA.
 * keyType: "public" (confidentiality) or "private" (textbook RSA style for lab/demo)
 */
function encryptRSA(plaintext, key, keyType = "public") {
  const buffer = Buffer.from(plaintext, "utf8");

  const encryptedBuffer =
    keyType === "private"
      ? crypto.privateEncrypt(
          {
            key,
            // privateEncrypt/publicDecrypt does not support OAEP.
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          buffer
        )
      : crypto.publicEncrypt(
          {
            key,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
          },
          buffer
        );

  return encryptedBuffer.toString("base64");
}

/**
 * Decrypt ciphertext with RSA.
 * keyType: "private" (for public-encrypted text) or "public" (for private-encrypted text)
 */
function decryptRSA(ciphertext, key, keyType = "private") {
  const encryptedBuffer = Buffer.from(ciphertext, "base64");

  const decryptedBuffer =
    keyType === "public"
      ? crypto.publicDecrypt(
          {
            key,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          encryptedBuffer
        )
      : crypto.privateDecrypt(
          {
            key,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
          },
          encryptedBuffer
        );

  return decryptedBuffer.toString("utf8");
}

/**
 * Read Key from file
 */
function readKeyFromFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("Key file not found: " + filePath);
  }
  return fs.readFileSync(filePath, "utf8");
}

module.exports = {
  generateRSAKeyPair,
  saveRSAKeys,
  encryptRSA,
  decryptRSA,
  readKeyFromFile,
};