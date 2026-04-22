// export default function Hashing() {
//   return (
//     <section style={{ maxWidth: 740, display: "grid", gap: 12 }}>
//       <h1>Hashing</h1>
//       <p style={{ color: "#6b7280" }}>
//         Chuc nang nay dang doi ban N.Gia Huy (N23DVCN023) phat trien theo README.
//       </p>
//       <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", padding: 14 }}>
//         Noi dung tam thoi: MD5, SHA-256 se duoc bo sung sau.
//       </div>
//     </section>
//   );
// }
"use client";

import { useState } from "react";
import CryptoJS from "crypto-js";

export default function Hashing() {
  const [text, setText] = useState("");
  const [md5, setMd5] = useState("");
  const [sha256, setSha256] = useState("");

  const handleHash = () => {
    const md5Hash = CryptoJS.MD5(text).toString();
    const sha256Hash = CryptoJS.SHA256(text).toString();

    setMd5(md5Hash);
    setSha256(sha256Hash);
  };

  return (
    <section style={{ maxWidth: 740, display: "grid", gap: 12 }}>
      <h1>Hashing (MD5 & SHA-256)</h1>

      <input
        type="text"
        placeholder="Nhap chuoi..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: 8 }}
      />

      <button onClick={handleHash}>Hash</button>

      {md5 && (
        <div>
          <p><b>MD5:</b> {md5}</p>
          <p><b>SHA-256:</b> {sha256}</p>
        </div>
      )}
    </section>
  );
}