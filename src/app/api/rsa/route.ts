import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

type RsaAction = "generate" | "encrypt" | "decrypt";
type RsaKeyType = "public" | "private";

function normalizePemKey(input: string) {
  return input.trim();
}

function normalizeBase64Ciphertext(input: string) {
  return input.replace(/\s+/g, "").trim();
}

function getRsaModulusBytes(key: string) {
  try {
    const publicKey = crypto.createPublicKey(key);
    const modulusLength = publicKey.asymmetricKeyDetails?.modulusLength;
    if (modulusLength) {
      return Math.ceil(modulusLength / 8);
    }
  } catch {
    // Try private key path below.
  }

  const privateKey = crypto.createPrivateKey(key);
  const modulusLength = privateKey.asymmetricKeyDetails?.modulusLength;
  if (!modulusLength) {
    throw new Error("Cannot detect RSA key size");
  }

  return Math.ceil(modulusLength / 8);
}

function getMaxPlaintextChunkSize(keyBytes: number, keyType: RsaKeyType) {
  if (keyType === "private") {
    // PKCS#1 v1.5 padding overhead is 11 bytes.
    return keyBytes - 11;
  }

  // OAEP with SHA-256 overhead: 2*hashLen + 2 = 66 bytes.
  return keyBytes - 66;
}

function splitBuffer(buffer: Buffer, chunkSize: number) {
  const chunks: Buffer[] = [];

  for (let offset = 0; offset < buffer.length; offset += chunkSize) {
    chunks.push(buffer.subarray(offset, offset + chunkSize));
  }

  return chunks;
}

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

function encryptRSA(plaintext: string, key: string, keyType: RsaKeyType = "public") {
  const normalizedKey = normalizePemKey(key);
  const plainBuffer = Buffer.from(plaintext, "utf8");
  const keyBytes = getRsaModulusBytes(normalizedKey);
  const maxChunkSize = getMaxPlaintextChunkSize(keyBytes, keyType);

  if (maxChunkSize <= 0) {
    throw new Error("Invalid RSA key size or padding settings");
  }

  const plainChunks = splitBuffer(plainBuffer, maxChunkSize);

  const encryptedChunks = plainChunks.map((chunk) =>
    keyType === "private"
      ? crypto.privateEncrypt(
          {
            key: normalizedKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          chunk
        )
      : crypto.publicEncrypt(
          {
            key: normalizedKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
          },
          chunk
        )
  );

  return Buffer.concat(encryptedChunks).toString("base64");
}

function decryptRSA(ciphertext: string, key: string, keyType: RsaKeyType = "private") {
  const normalizedKey = normalizePemKey(key);
  const normalizedCiphertext = normalizeBase64Ciphertext(ciphertext);
  const encryptedBuffer = Buffer.from(normalizedCiphertext, "base64");
  const keyBytes = getRsaModulusBytes(normalizedKey);

  if (encryptedBuffer.length === 0 || encryptedBuffer.length % keyBytes !== 0) {
    throw new Error("Invalid ciphertext length for this RSA key");
  }

  const encryptedChunks = splitBuffer(encryptedBuffer, keyBytes);

  const decryptedChunks = encryptedChunks.map((chunk) =>
    keyType === "public"
      ? crypto.publicDecrypt(
          {
            key: normalizedKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          chunk
        )
      : crypto.privateDecrypt(
          {
            key: normalizedKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
          },
          chunk
        )
  );

  return Buffer.concat(decryptedChunks).toString("utf8");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      action: RsaAction;
      plaintext?: string;
      ciphertext?: string;
      key?: string;
      keyType?: RsaKeyType;
    };

    if (body.action === "generate") {
      const keys = generateRSAKeyPair();
      return NextResponse.json(keys);
    }

    if (body.action === "encrypt") {
      if (!body.plaintext || !body.key) {
        return NextResponse.json({ error: "Missing plaintext or key" }, { status: 400 });
      }

      const result = encryptRSA(body.plaintext, body.key, body.keyType ?? "public");
      return NextResponse.json({ result });
    }

    if (body.action === "decrypt") {
      if (!body.ciphertext || !body.key) {
        return NextResponse.json({ error: "Missing ciphertext or key" }, { status: 400 });
      }

      const selectedKeyType = body.keyType ?? "private";

      let result: string;
      try {
        result = decryptRSA(body.ciphertext, body.key, selectedKeyType);
      } catch {
        // Common user mistake: selected wrong key type in UI.
        const fallbackKeyType: RsaKeyType = selectedKeyType === "private" ? "public" : "private";
        result = decryptRSA(body.ciphertext, body.key, fallbackKeyType);
      }

      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown RSA error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
