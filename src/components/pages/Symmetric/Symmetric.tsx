"use client";
import { useState } from "react";
import {
  encryptAES,
  decryptAES,
  encryptDES,
  decryptDES,
  encrypt3DES,
  decrypt3DES,
  generateKey,
} from "@/utils/crypto";

export default function Symmetric() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [algo, setAlgo] = useState("AES");

  const handleEncrypt = () => {
    if (algo === "AES") setResult(encryptAES(text, key));
    if (algo === "DES") setResult(encryptDES(text, key));
    if (algo === "3DES") setResult(encrypt3DES(text, key));
  };

  const handleDecrypt = () => {
    if (algo === "AES") setResult(decryptAES(text, key));
    if (algo === "DES") setResult(decryptDES(text, key));
    if (algo === "3DES") setResult(decrypt3DES(text, key));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Symmetric Encryption</h1>

      <select onChange={(e) => setAlgo(e.target.value)}>
        <option value="AES">AES</option>
        <option value="DES">DES</option>
        <option value="3DES">3DES</option>
      </select>

      <br /><br />

      <textarea
        placeholder="Enter text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Secret Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />

      <button onClick={() => setKey(generateKey())}>
        Generate Key
      </button>

      <br /><br />

      <button onClick={handleEncrypt}>Encrypt</button>
      <button onClick={handleDecrypt}>Decrypt</button>

      <h3>Result:</h3>
      <p>{result}</p>
    </div>
  );
}