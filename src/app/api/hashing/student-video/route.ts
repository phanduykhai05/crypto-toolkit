import { createReadStream, promises as fs } from "fs";
import path from "path";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const STUDENT_FOLDER = "N23DVCN023-N-Gia-Huy";
const VIDEO_FILES = {
  1: "task1.mp4",
  2: "task2.mp4",
  3: "task3.mp4",
} as const;

function parseTask(value: string | null) {
  if (!value) {
    return null;
  }

  const task = Number(value);

  if (!Number.isInteger(task) || task < 1 || task > 3) {
    return null;
  }

  return task as 1 | 2 | 3;
}

export async function GET(request: NextRequest) {
  const task = parseTask(request.nextUrl.searchParams.get("task"));

  if (!task) {
    return NextResponse.json({ error: "Invalid task. Use 1, 2 or 3." }, { status: 400 });
  }

  try {
    const fileName = VIDEO_FILES[task];
    const videoPath = path.join(process.cwd(), "labs", "students", STUDENT_FOLDER, fileName);
    const stat = await fs.stat(videoPath);
    const fileSize = stat.size;
    const range = request.headers.get("range");

    if (!range) {
      const stream = createReadStream(videoPath);
      const body = Readable.toWeb(stream) as ReadableStream<Uint8Array>;

      return new Response(body, {
        status: 200,
        headers: {
          "Content-Type": "video/mp4",
          "Content-Length": String(fileSize),
          "Accept-Ranges": "bytes",
          "Cache-Control": "no-store",
        },
      });
    }

    const [startRaw, endRaw] = range.replace(/bytes=/, "").split("-");
    const start = Number(startRaw);
    const end = endRaw ? Number(endRaw) : fileSize - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || end >= fileSize || start > end) {
      return new Response("Invalid range", { status: 416 });
    }

    const chunkSize = end - start + 1;
    const stream = createReadStream(videoPath, { start, end });
    const body = Readable.toWeb(stream) as ReadableStream<Uint8Array>;

    return new Response(body, {
      status: 206,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(chunkSize),
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Cannot load student video" }, { status: 404 });
  }
}
