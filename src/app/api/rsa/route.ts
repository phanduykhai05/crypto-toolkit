import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

type RsaAction = "generate" | "encrypt" | "decrypt";
type RsaKeyType = "public" | "private";

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
  const buffer = Buffer.from(plaintext, "utf8");

  const encryptedBuffer =
    keyType === "private"
      ? crypto.privateEncrypt(
          {
            key,
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

function decryptRSA(ciphertext: string, key: string, keyType: RsaKeyType = "private") {
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

      const result = decryptRSA(body.ciphertext, body.key, body.keyType ?? "private");
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown RSA error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
