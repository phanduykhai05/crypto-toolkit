import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const readmePath = path.join(
      process.cwd(),
      "src",
      "components",
      "pages",
      "Asymmetric",
      "README.md"
    );

    const content = await fs.readFile(readmePath, "utf8");

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: "Cannot load RSA documentation" }, { status: 500 });
  }
}
