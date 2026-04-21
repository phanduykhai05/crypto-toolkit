import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
const studentFolder = "N23DVCN022-T-Gia-Huy";

export const runtime = "nodejs";

type SeedTaskId = 1 | 2 | 3 | 4 | 5 | 6;
type ExecutionMode = "node-results-only";

type TaskResult = {
  stdout: string;
  stderr: string;
  mode: ExecutionMode;
};

function parseTask(value: unknown): SeedTaskId | null {
  if (typeof value !== "number") {
    return null;
  }

  if (!Number.isInteger(value) || value < 1 || value > 6) {
    return null;
  }

  return value as SeedTaskId;
}

function getExecutableName(task: SeedTaskId) {
  return process.platform === "win32" ? `task${task}.exe` : `task${task}`;
}

async function compileAndRunTask(task: SeedTaskId) {
  const root = process.cwd();
  const sourceFile = path.join(root, "labs", "students", studentFolder, "seed-rsa", `task${task}.c`);
  const outputDir = path.join(root, ".tmp", "seed-rsa-lab", studentFolder);
  const outputBinary = path.join(outputDir, getExecutableName(task));

  await fs.mkdir(outputDir, { recursive: true });

  await execFileAsync("gcc", [sourceFile, "-lcrypto", "-o", outputBinary], {
    cwd: root,
    windowsHide: true,
    timeout: 60_000,
    maxBuffer: 1024 * 1024,
  });

  const runResult = await execFileAsync(outputBinary, [], {
    cwd: root,
    windowsHide: true,
    timeout: 60_000,
    maxBuffer: 1024 * 1024,
  });

  return {
    stdout: runResult.stdout,
    stderr: runResult.stderr,
    mode: "native-c" as const,
  };
}

function hexToBigInt(hex: string) {
  return BigInt(`0x${hex}`);
}

function bigIntToHex(value: bigint) {
  return value.toString(16).toUpperCase();
}

function modPow(base: bigint, exponent: bigint, modulus: bigint) {
  if (modulus === 1n) {
    return 0n;
  }

  let result = 1n;
  let nextBase = base % modulus;
  let nextExponent = exponent;

  while (nextExponent > 0n) {
    if (nextExponent & 1n) {
      result = (result * nextBase) % modulus;
    }

    nextExponent >>= 1n;
    nextBase = (nextBase * nextBase) % modulus;
  }

  return result;
}

function egcd(a: bigint, b: bigint): { g: bigint; x: bigint; y: bigint } {
  if (b === 0n) {
    return { g: a, x: 1n, y: 0n };
  }

  const { g, x, y } = egcd(b, a % b);
  return { g, x: y, y: x - (a / b) * y };
}

function modInverse(a: bigint, n: bigint) {
  const { g, x } = egcd(a, n);

  if (g !== 1n) {
    throw new Error("Modular inverse does not exist");
  }

  return (x % n + n) % n;
}

function messageToHex(message: string) {
  return Buffer.from(message, "utf8").toString("hex").toUpperCase();
}

function buildNodeFallbackResult(task: SeedTaskId): TaskResult {
  if (task === 1) {
    const p = hexToBigInt("F7E75FDC469067FFDC4E847C51F452DF");
    const q = hexToBigInt("E85CED54AF57E53E092113E62F436F4F");
    const e = hexToBigInt("0D88C3");
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    const d = modInverse(e, phi);

    return {
      mode: "node-results-only",
      stderr: "",
      stdout: [
        "[results-only] Running task with BigInt implementation (native C execution disabled for demo).",
        `n = ${bigIntToHex(n)}`,
        `phi(n) = ${bigIntToHex(phi)}`,
        `Private key d = ${bigIntToHex(d)}`,
      ].join("\n"),
    };
  }

  if (task === 2) {
    const n = hexToBigInt("DCBFFE3E51F62E09CE7032E2677A78946A849DC4CDDE3A4D0CB81629242FB1A5");
    const e = hexToBigInt("010001");
    const m = hexToBigInt("4120746F702073656372657421");
    const c = modPow(m, e, n);

    return {
      mode: "node-results-only",
      stderr: "",
      stdout: [
        "[results-only] Running task with BigInt implementation (native C execution disabled for demo).",
        `Message hex M = ${bigIntToHex(m)}`,
        `Ciphertext C = ${bigIntToHex(c)}`,
      ].join("\n"),
    };
  }

  if (task === 3) {
    const n = hexToBigInt("DCBFFE3E51F62E09CE7032E2677A78946A849DC4CDDE3A4D0CB81629242FB1A5");
    const d = hexToBigInt("74D806F9F3A62BAE331FFE3F0A68AFE35B3D2E4794148AACBC26AA381CD7D30D");
    const c = hexToBigInt("8C0F971DF2F3672B28811407E2DABBE1DA0FEBBBDFC7DCB67396567EA1E2493F");
    const m = modPow(c, d, n);
    const mHex = bigIntToHex(m);
    const recovered = Buffer.from(mHex.length % 2 === 0 ? mHex : `0${mHex}`, "hex").toString("utf8");

    return {
      mode: "node-results-only",
      stderr: "",
      stdout: [
        "[results-only] Running task with BigInt implementation (native C execution disabled for demo).",
        `Ciphertext C = ${bigIntToHex(c)}`,
        `Decrypted M (hex) = ${mHex}`,
        `Recovered ASCII = ${recovered}`,
      ].join("\n"),
    };
  }

  if (task === 4) {
    const n = hexToBigInt("DCBFFE3E51F62E09CE7032E2677A78946A849DC4CDDE3A4D0CB81629242FB1A5");
    const d = hexToBigInt("74D806F9F3A62BAE331FFE3F0A68AFE35B3D2E4794148AACBC26AA381CD7D30D");
    const m1 = hexToBigInt("49206F776520796F752024323030302E");
    const m2 = hexToBigInt("49206F776520796F752024333030302E");
    const s1 = modPow(m1, d, n);
    const s2 = modPow(m2, d, n);

    return {
      mode: "node-results-only",
      stderr: "",
      stdout: [
        "[results-only] Running task with BigInt implementation (native C execution disabled for demo).",
        `M1 = I owe you $2000. (hex) ${bigIntToHex(m1)}`,
        `Signature S1 = ${bigIntToHex(s1)}`,
        `M2 = I owe you $3000. (hex) ${bigIntToHex(m2)}`,
        `Signature S2 = ${bigIntToHex(s2)}`,
        s1 === s2
          ? "Observation: signatures are identical (unexpected for different messages)."
          : "Observation: signatures are completely different after small message change.",
      ].join("\n"),
    };
  }

  if (task === 5) {
    const n = hexToBigInt("AE1CD4DC432798D933779FBD46C6E1247F0CF1233595113AA51B450F18116115");
    const e = hexToBigInt("010001");
    const expected = hexToBigInt(messageToHex("Launch a missile."));
    const s1 = hexToBigInt("643D6F34902D9C7EC90CB0B2BCA36C47FA37165C0005CAB026C0542CBDB6802F");
    const s2 = hexToBigInt("643D6F34902D9C7EC90CB0B2BCA36C47FA37165C0005CAB026C0542CBDB6803F");
    const m1 = modPow(s1, e, n);
    const m2 = modPow(s2, e, n);

    return {
      mode: "node-results-only",
      stderr: "",
      stdout: [
        "[results-only] Running task with BigInt implementation (native C execution disabled for demo).",
        "Case 1: Original signature (ending with 2F)",
        `Recovered message M' = ${bigIntToHex(m1)}`,
        m1 === expected ? "Verification result: VALID signature." : "Verification result: INVALID signature.",
        "",
        "Case 2: Corrupted signature (last byte changed to 3F)",
        `Recovered message M' = ${bigIntToHex(m2)}`,
        m2 === expected ? "Verification result: VALID signature." : "Verification result: INVALID signature.",
      ].join("\n"),
    };
  }

  const n = hexToBigInt(
    "A9FF9C7F451E70A8539FCAD9E50DDE4657577DBC8F9A5AAC46F1849ABB91DBC9FB2F01FB920900165EA01CF8C1ABF9782F4ACCD885A2D8593C0ED318FBB1F5240D26EEB65B64767C14C72F7ACEA84CB7F4D908FCDF87233520A8E269E28C4E3FB159FA60A21EB3C920531982CA36536D604DE90091FC768D5C080F0AC2DCF1736BC5136E0A4F7AC2F2021C2EB46383DA31F62D7530B2FBABC26EDBA9C00EB9F967D4C3255774EB05B4E98EB5DE28CDCC7A14E47103CB4D612E6157C519A90B98841AE87929D9B28D2FFF576A66E0CEAB95A82996637012671E3AE1DBB02171D77C9EFDAA176EFE2BFB381714D166A7AF9AB570CCC863813A8CC02AA97637CEE3"
  );
  const e = 65537n;
  const s = hexToBigInt(
    "76317179C296E31D78500A1BA3CD1EE17AE381C80B8BCE26A7649C7CD5225BA90481D48400AFB07D18A5669F3A369655CB0BDF9FC529ECF0A2C4CE0A2D5C7496388650B129BF5D2140E7A463649F29609230019E2E78561C86FBD1C7729418565C5AF999B2E4C52D78FCD387DB38F8DCC4004FF5B087263B3D1837DDB7164B6EDA9674D252606C67E2AC1E9D903FF7A7E820CBB5AAC4FE2D73CF331F46113627DBE380851ACAB70782EF8A3AA7904E3597E708A832ED6F988C13ABD316EF190BAE498DE2F8EE7B71CA5C89C11F2F32D046E1B42C6D2A4613490E42D59A3B349EBDAE908EAD1925B85101AB7E760F38985AB3CF6E354DC4E240DC565BFFD2D4CE"
  );
  const decoded = modPow(s, e, n);

  return {
    mode: "node-results-only",
    stderr: "",
    stdout: [
      "[results-only] Running task with BigInt implementation (native C execution disabled for demo).",
      `Decoded signature block = ${bigIntToHex(decoded)}`,
      "Check PKCS#1 padding and SHA-256 digest manually against c0_body.bin hash.",
    ].join("\n"),
  };
}

function isToolchainErrorMessage(_message: string) {
  return false;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown execution error";
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as { task?: number };
    const task = parseTask(payload.task);

    if (!task) {
      return NextResponse.json(
        { error: "Invalid task. Use task number from 1 to 6." },
        { status: 400 }
      );
    }

    const result = buildNodeFallbackResult(task);

    return NextResponse.json({
      task,
      source: `labs/students/${studentFolder}/seed-rsa/task${task}.c`,
      stdout: result.stdout,
      stderr: result.stderr,
      mode: "node-results-only",
    });
  } catch (error) {
    const message = getErrorMessage(error);

    const missingToolHint = /ENOENT|not recognized|cannot find/i.test(message)
      ? "Missing gcc/OpenSSL toolchain. Install gcc and OpenSSL development libraries first."
      : null;

    return NextResponse.json(
      {
        error: message,
        hint: missingToolHint,
      },
      { status: 500 }
    );
  }
}
