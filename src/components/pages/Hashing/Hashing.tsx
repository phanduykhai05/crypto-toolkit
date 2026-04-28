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

const studentVideos = [
  { task: 1, title: "Task 1: Becoming a Certificate Authority (CA)" },
  { task: 2, title: "Task 2: Creating a Certificate for ptit.com" },
  { task: 3, title: "Task 3: Deploying the Certificate on an HTTPS Web Server Using OpenSSL" },
] as const;

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
      <h1>Cryptography Toolkit</h1>
      <h2>(Feature 3: Hash Functions)</h2>
      <h3>Hashing (MD5 & SHA-256)</h3>
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

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          background: "#fff",
          padding: 14,
          display: "grid",
          gap: 10,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18 }}>Video sinh vien N23DVCN023-N-Gia-Huy</h2>
        <p style={{ margin: 0, color: "#4b5563", fontSize: 14 }}>
          {/* Video minh hoa cac bai task Hashing (MD5 & SHA-256). */}
          Video minh hoa cac bai tap task 1-3 PUBLIC-KEY INFRASTRUCTURE (PKI)
          Video minh hoa cac bai task Hashing (MD5 & SHA-256).
        </p>

        {studentVideos.map((video) => (
          <div
            key={video.task}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: 10,
              display: "grid",
              gap: 8,
            }}
          >
            <strong>{video.title}</strong>
            <video
              controls
              preload="metadata"
              style={{ width: "100%", borderRadius: 8, background: "#000" }}
              src={`/api/hashing/student-video?task=${video.task}`}
            >
              Trinh duyet khong ho tro video.
            </video>
          </div>
        ))}
      </div>
    </section>
  );
}