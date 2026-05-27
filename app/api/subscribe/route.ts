import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

interface Entry {
  email: string;
  timestamp: string;
  source: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATA_DIR  = join(process.cwd(), "data");
const EMAILS_FILE = join(DATA_DIR, "emails.json");

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json();
    const email  = String(body.email  ?? "").trim().toLowerCase();
    const source = String(body.source ?? "web").trim();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Email invalide." },
        { status: 400 },
      );
    }

    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }

    let entries: Entry[] = [];
    if (existsSync(EMAILS_FILE)) {
      const raw = await readFile(EMAILS_FILE, "utf-8");
      entries = JSON.parse(raw) as Entry[];
    }

    // Silently succeed for duplicates
    if (!entries.some((e) => e.email === email)) {
      entries.push({ email, timestamp: new Date().toISOString(), source });
      await writeFile(EMAILS_FILE, JSON.stringify(entries, null, 2), "utf-8");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
