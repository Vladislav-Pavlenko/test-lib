import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma/prisma";

export async function GET() {
  const tests = await prisma.test.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(tests);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const test = await prisma.test.create({ data });
    return NextResponse.json(test);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await prisma.test.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
