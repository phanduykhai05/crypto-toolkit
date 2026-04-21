const { spawn } = require("child_process");
const { mkdirSync, existsSync } = require("fs");
const path = require("path");

const input = process.argv[2];
const task = Number(input);
const studentFolder = "N23DVCN022-T-Gia-Huy";

if (!Number.isInteger(task) || task < 1 || task > 6) {
  console.error("Usage: npm run lab:rsa:run -- <taskNumber 1..6>");
  process.exit(1);
}

const root = process.cwd();
const sourceFile = path.join(root, "labs", "students", studentFolder, "seed-rsa", `task${task}.c`);
const outputDir = path.join(root, ".tmp", "seed-rsa-lab", studentFolder);

if (!existsSync(sourceFile)) {
  console.error(`Cannot find source file: ${sourceFile}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

function hexToBigInt(hex) {
  return BigInt(`0x${hex}`);
}

function bigIntToHex(value) {
  return value.toString(16).toUpperCase();
}

function modPow(base, exponent, modulus) {
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

function egcd(a, b) {
  if (b === 0n) {
    return { g: a, x: 1n, y: 0n };
  }

  const { g, x, y } = egcd(b, a % b);
  return { g, x: y, y: x - (a / b) * y };
}

function modInverse(a, n) {
  const { g, x } = egcd(a, n);

  if (g !== 1n) {
    throw new Error("Modular inverse does not exist");
  }

  return (x % n + n) % n;
}

function messageToHex(message) {
  return Buffer.from(message, "utf8").toString("hex").toUpperCase();
}

function runFallback(selectedTask) {
  const prefix = "[results-only] Running task with BigInt implementation (native C execution disabled for demo).";

  if (selectedTask === 1) {
    const p = hexToBigInt("F7E75FDC469067FFDC4E847C51F452DF");
    const q = hexToBigInt("E85CED54AF57E53E092113E62F436F4F");
    const e = hexToBigInt("0D88C3");
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    const d = modInverse(e, phi);

    console.log(prefix);
    console.log(`n = ${bigIntToHex(n)}`);
    console.log(`phi(n) = ${bigIntToHex(phi)}`);
    console.log(`Private key d = ${bigIntToHex(d)}`);
    return;
  }

  if (selectedTask === 2) {
    const n = hexToBigInt("DCBFFE3E51F62E09CE7032E2677A78946A849DC4CDDE3A4D0CB81629242FB1A5");
    const e = hexToBigInt("010001");
    const m = hexToBigInt("4120746F702073656372657421");
    const c = modPow(m, e, n);

    console.log(prefix);
    console.log(`Message hex M = ${bigIntToHex(m)}`);
    console.log(`Ciphertext C = ${bigIntToHex(c)}`);
    return;
  }

  if (selectedTask === 3) {
    const n = hexToBigInt("DCBFFE3E51F62E09CE7032E2677A78946A849DC4CDDE3A4D0CB81629242FB1A5");
    const d = hexToBigInt("74D806F9F3A62BAE331FFE3F0A68AFE35B3D2E4794148AACBC26AA381CD7D30D");
    const c = hexToBigInt("8C0F971DF2F3672B28811407E2DABBE1DA0FEBBBDFC7DCB67396567EA1E2493F");
    const m = modPow(c, d, n);
    const mHex = bigIntToHex(m);
    const recovered = Buffer.from(mHex.length % 2 === 0 ? mHex : `0${mHex}`, "hex").toString("utf8");

    console.log(prefix);
    console.log(`Ciphertext C = ${bigIntToHex(c)}`);
    console.log(`Decrypted M (hex) = ${mHex}`);
    console.log(`Recovered ASCII = ${recovered}`);
    return;
  }

  if (selectedTask === 4) {
    const n = hexToBigInt("DCBFFE3E51F62E09CE7032E2677A78946A849DC4CDDE3A4D0CB81629242FB1A5");
    const d = hexToBigInt("74D806F9F3A62BAE331FFE3F0A68AFE35B3D2E4794148AACBC26AA381CD7D30D");
    const m1 = hexToBigInt("49206F776520796F752024323030302E");
    const m2 = hexToBigInt("49206F776520796F752024333030302E");
    const s1 = modPow(m1, d, n);
    const s2 = modPow(m2, d, n);

    console.log(prefix);
    console.log(`M1 = I owe you $2000. (hex) ${bigIntToHex(m1)}`);
    console.log(`Signature S1 = ${bigIntToHex(s1)}`);
    console.log(`M2 = I owe you $3000. (hex) ${bigIntToHex(m2)}`);
    console.log(`Signature S2 = ${bigIntToHex(s2)}`);
    console.log(
      s1 === s2
        ? "Observation: signatures are identical (unexpected for different messages)."
        : "Observation: signatures are completely different after small message change."
    );
    return;
  }

  if (selectedTask === 5) {
    const n = hexToBigInt("AE1CD4DC432798D933779FBD46C6E1247F0CF1233595113AA51B450F18116115");
    const e = hexToBigInt("010001");
    const expected = hexToBigInt(messageToHex("Launch a missile."));
    const s1 = hexToBigInt("643D6F34902D9C7EC90CB0B2BCA36C47FA37165C0005CAB026C0542CBDB6802F");
    const s2 = hexToBigInt("643D6F34902D9C7EC90CB0B2BCA36C47FA37165C0005CAB026C0542CBDB6803F");
    const m1 = modPow(s1, e, n);
    const m2 = modPow(s2, e, n);

    console.log(prefix);
    console.log("Case 1: Original signature (ending with 2F)");
    console.log(`Recovered message M' = ${bigIntToHex(m1)}`);
    console.log(m1 === expected ? "Verification result: VALID signature." : "Verification result: INVALID signature.");
    console.log("");
    console.log("Case 2: Corrupted signature (last byte changed to 3F)");
    console.log(`Recovered message M' = ${bigIntToHex(m2)}`);
    console.log(m2 === expected ? "Verification result: VALID signature." : "Verification result: INVALID signature.");
    return;
  }

  const n = hexToBigInt(
    "A9FF9C7F451E70A8539FCAD9E50DDE4657577DBC8F9A5AAC46F1849ABB91DBC9FB2F01FB920900165EA01CF8C1ABF9782F4ACCD885A2D8593C0ED318FBB1F5240D26EEB65B64767C14C72F7ACEA84CB7F4D908FCDF87233520A8E269E28C4E3FB159FA60A21EB3C920531982CA36536D604DE90091FC768D5C080F0AC2DCF1736BC5136E0A4F7AC2F2021C2EB46383DA31F62D7530B2FBABC26EDBA9C00EB9F967D4C3255774EB05B4E98EB5DE28CDCC7A14E47103CB4D612E6157C519A90B98841AE87929D9B28D2FFF576A66E0CEAB95A82996637012671E3AE1DBB02171D77C9EFDAA176EFE2BFB381714D166A7AF9AB570CCC863813A8CC02AA97637CEE3"
  );
  const e = 65537n;
  const s = hexToBigInt(
    "76317179C296E31D78500A1BA3CD1EE17AE381C80B8BCE26A7649C7CD5225BA90481D48400AFB07D18A5669F3A369655CB0BDF9FC529ECF0A2C4CE0A2D5C7496388650B129BF5D2140E7A463649F29609230019E2E78561C86FBD1C7729418565C5AF999B2E4C52D78FCD387DB38F8DCC4004FF5B087263B3D1837DDB7164B6EDA9674D252606C67E2AC1E9D903FF7A7E820CBB5AAC4FE2D73CF331F46113627DBE380851ACAB70782EF8A3AA7904E3597E708A832ED6F988C13ABD316EF190BAE498DE2F8EE7B71CA5C89C11F2F32D046E1B42C6D2A4613490E42D59A3B349EBDAE908EAD1925B85101AB7E760F38985AB3CF6E354DC4E240DC565BFFD2D4CE"
  );
  const decoded = modPow(s, e, n);

  console.log(prefix);
  console.log(`Decoded signature block = ${bigIntToHex(decoded)}`);
  console.log("Check PKCS#1 padding and SHA-256 digest manually against c0_body.bin hash.");
}

try {
  console.log("Results-only mode: skip native C execution, using Node.js BigInt results.");
  runFallback(task);
  process.exit(0);
} catch (error) {
  console.error(`Results-only execution failed: ${error.message}`);
  process.exit(1);
}
