"use client";

import { useState } from "react";

type SeedTask = 1 | 2 | 3 | 4 | 5 | 6;

export default function GiaHuySeedRsaRunner() {
  const [selectedTask, setSelectedTask] = useState<SeedTask>(1);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runTask = async () => {
    setIsRunning(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch("/api/asymmetric/seed-rsa/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: selectedTask }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.hint ? `${data.error}\n${data.hint}` : data.error ?? "Cannot run SEED task");
      }

      const stdout = (data.stdout ?? "").trim();
      const stderr = (data.stderr ?? "").trim();
      const nextOutput = [
        `Task ${data.task} - ${data.source}`,
        "",
        stdout ? `STDOUT:\n${stdout}` : "STDOUT: (empty)",
        stderr ? `\nSTDERR:\n${stderr}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      setOutput(nextOutput);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cannot run SEED task");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section
      style={{
        border: "1px dashed #0f766e",
        borderRadius: 12,
        padding: 12,
        display: "grid",
        gap: 10,
        background: "#f0fdfa",
      }}
    >
      <strong>SEED RSA Lab Runner - T. Gia Huy (N23DVCN022)</strong>
      <p style={{ margin: 0, color: "#134e4a" }}>
        Muc rieng cho sinh vien N23DVCN022. Chay truc tiep task1.c den task6.c trong
        labs/students/N23DVCN022-T-Gia-Huy/seed-rsa.
      </p>

      <label>
        Chon task
        <select
          value={selectedTask}
          onChange={(event) => setSelectedTask(Number(event.target.value) as SeedTask)}
        >
          <option value={1}>Task 1 - Derive private key d</option>
          <option value={2}>Task 2 - Encrypt message</option>
          <option value={3}>Task 3 - Decrypt ciphertext</option>
          <option value={4}>Task 4 - Sign and compare</option>
          <option value={5}>Task 5 - Verify signature and corrupted signature</option>
          <option value={6}>Task 6 - Manual certificate verify core step</option>
        </select>
      </label>

      <button onClick={runTask} disabled={isRunning}>
        {isRunning ? "Dang bien dich va chay..." : `Run Task ${selectedTask}`}
      </button>

      <p style={{ margin: 0, fontSize: 13, color: "#0f766e" }}>
        Hien thi ket qua truc tiep (khong bien dich/chay source C tren may).
      </p>

      {error && <p style={{ color: "#b91c1c", whiteSpace: "pre-wrap", margin: 0 }}>{error}</p>}

      {output && (
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#042f2e",
            color: "#ecfeff",
            borderRadius: 10,
            padding: 12,
            lineHeight: 1.5,
            fontSize: 13,
          }}
        >
          {output}
        </pre>
      )}
    </section>
  );
}
