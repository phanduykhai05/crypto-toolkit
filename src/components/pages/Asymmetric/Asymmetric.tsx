"use client";

import { useState } from "react";

type RsaKeyType = "public" | "private";
type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

async function callRsaApi(payload: Record<string, unknown>) {
  const response = await fetch("/api/rsa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "RSA request failed");
  }

  return data;
}

export default function Asymmetric() {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [readmeContent, setReadmeContent] = useState("");
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
  const [isReadmeLoading, setIsReadmeLoading] = useState(false);

  const [encryptKeyType, setEncryptKeyType] = useState<RsaKeyType>("public");
  const [decryptKeyType, setDecryptKeyType] = useState<RsaKeyType>("private");

  const [encryptKey, setEncryptKey] = useState("");
  const [decryptKey, setDecryptKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2500);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard", "success");
    } catch {
      const message = "Cannot copy to clipboard on this browser.";
      setError(message);
      showToast(message, "error");
    }
  };

  const generateKeys = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await callRsaApi({ action: "generate" });
      setPublicKey(data.publicKey ?? "");
      setPrivateKey(data.privateKey ?? "");
      setEncryptKey(data.publicKey ?? "");
      setDecryptKey(data.privateKey ?? "");
      showToast("RSA key pair generated", "success");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Cannot generate keys";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const encrypt = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await callRsaApi({
        action: "encrypt",
        plaintext,
        key: encryptKey,
        keyType: encryptKeyType,
      });
      setCiphertext(data.result ?? "");

      const nextDecryptKeyType: RsaKeyType = encryptKeyType === "public" ? "private" : "public";
      setDecryptKeyType(nextDecryptKeyType);

      if (nextDecryptKeyType === "private" && privateKey) {
        setDecryptKey(privateKey);
      }

      if (nextDecryptKeyType === "public" && publicKey) {
        setDecryptKey(publicKey);
      }
      showToast("Encryption successful", "success");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Cannot encrypt";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const decrypt = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await callRsaApi({
        action: "decrypt",
        ciphertext,
        key: decryptKey,
        keyType: decryptKeyType,
      });
      setPlaintext(data.result ?? "");
      showToast("Decryption successful", "success");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Cannot decrypt";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const openReadme = async () => {
    setIsReadmeOpen(true);

    if (readmeContent || isReadmeLoading) {
      return;
    }

    setIsReadmeLoading(true);

    try {
      const response = await fetch("/api/docs/asymmetric-readme");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Cannot load documentation");
      }

      setReadmeContent(data.content ?? "");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Cannot load documentation";
      setError(message);
      showToast(message, "error");
      setReadmeContent("# Loi tai tai lieu\nVui long thu lai sau.");
    } finally {
      setIsReadmeLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24, display: "grid", gap: 16 }}>
      <h1>Asymmetric Encryption (RSA)</h1>

      <section
        style={{
          border: "1px dashed #64748b",
          borderRadius: 12,
          padding: 12,
          display: "grid",
          gap: 8,
          background: "#f8fafc",
        }}
      >
        <strong>Tai lieu huong dan RSA</strong>
        <p style={{ margin: 0, color: "#334155" }}>
          Xem mo ta chi tiet thuat toan, luong xu ly, va huong dan su dung ngay tren web.
        </p>
        <button onClick={openReadme} disabled={isReadmeLoading}>
          {isReadmeLoading ? "Dang tai tai lieu..." : "Mo tai lieu RSA"}
        </button>
      </section>

      <section style={{ display: "grid", gap: 8 }}>
        <button onClick={generateKeys} disabled={loading}>Generate RSA Key Pair</button>
        <label>
          Public Key
          <textarea rows={8} value={publicKey} onChange={(e) => setPublicKey(e.target.value)} />
        </label>
        <button onClick={() => copyToClipboard(publicKey)} disabled={!publicKey}>Copy Public Key</button>

        <label>
          Private Key
          <textarea rows={8} value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
        </label>
        <button onClick={() => copyToClipboard(privateKey)} disabled={!privateKey}>Copy Private Key</button>
      </section>

      <section style={{ borderTop: "1px solid #ddd", paddingTop: 12, display: "grid", gap: 8 }}>
        <h2>Encrypt</h2>
        <label>
          Plaintext
          <textarea rows={4} value={plaintext} onChange={(e) => setPlaintext(e.target.value)} />
        </label>

        <label>
          Encrypt Key Type
          <select value={encryptKeyType} onChange={(e) => setEncryptKeyType(e.target.value as RsaKeyType)}>
            <option value="public">Public key (recommended)</option>
            <option value="private">Private key (lab/demo)</option>
          </select>
        </label>

        <label>
          Key Input
          <textarea rows={8} value={encryptKey} onChange={(e) => setEncryptKey(e.target.value)} />
        </label>

        <button onClick={encrypt} disabled={loading || !plaintext || !encryptKey}>Encrypt</button>
      </section>

      <section style={{ borderTop: "1px solid #ddd", paddingTop: 12, display: "grid", gap: 8 }}>
        <h2>Decrypt</h2>
        <label>
          Ciphertext (Base64)
          <textarea rows={6} value={ciphertext} onChange={(e) => setCiphertext(e.target.value)} />
        </label>

        <button onClick={() => copyToClipboard(ciphertext)} disabled={!ciphertext}>Copy Ciphertext</button>

        <label>
          Decrypt Key Type
          <select value={decryptKeyType} onChange={(e) => setDecryptKeyType(e.target.value as RsaKeyType)}>
            <option value="private">Private key (for public-encrypted text)</option>
            <option value="public">Public key (for private-encrypted text)</option>
          </select>
        </label>

        <label>
          Key Input
          <textarea rows={8} value={decryptKey} onChange={(e) => setDecryptKey(e.target.value)} />
        </label>

        <button onClick={decrypt} disabled={loading || !ciphertext || !decryptKey}>Decrypt</button>
      </section>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          display: "grid",
          gap: 8,
          zIndex: 1000,
          maxWidth: 360,
        }}
      >
        {toasts.map((toast) => {
          const backgroundColor =
            toast.type === "success" ? "#16a34a" : toast.type === "error" ? "#dc2626" : "#2563eb";

          return (
            <div
              key={toast.id}
              style={{
                color: "#fff",
                background: backgroundColor,
                borderRadius: 10,
                padding: "10px 12px",
                boxShadow: "0 8px 16px rgba(0,0,0,0.18)",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {toast.message}
            </div>
          );
        })}
      </div>

      {isReadmeOpen && (
        <div
          onClick={() => setIsReadmeOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2, 6, 23, 0.65)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <article
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(980px, 100%)",
              maxHeight: "88vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: 14,
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.35)",
              padding: 20,
              display: "grid",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <h2 style={{ margin: 0 }}>Tai lieu Asymmetric RSA</h2>
              <button onClick={() => setIsReadmeOpen(false)}>Dong</button>
            </div>

            {isReadmeLoading ? (
              <p>Dang tai noi dung README...</p>
            ) : (
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: 14,
                  lineHeight: 1.55,
                  fontSize: 14,
                }}
              >
                {readmeContent}
              </pre>
            )}
          </article>
        </div>
      )}
    </main>
  );
}
