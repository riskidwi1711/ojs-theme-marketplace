import { NextResponse } from "next/server";
import { getThemes, searchThemes } from "@/server/themes";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const items = q ? await searchThemes(q) : await getThemes();
  return NextResponse.json({ items });
}
