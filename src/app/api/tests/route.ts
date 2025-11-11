import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma/prisma";

export async function GET() {
  const tests = await prisma.test.findMany({
    orderBy: { createdAt: "desc" },
    include: { genre: true },
  });
  return NextResponse.json(tests);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.genreId || isNaN(Number(data.genreId))) {
      return NextResponse.json(
        { error: "genreId is required and must be a number" },
        { status: 400 },
      );
    }
    const test = await prisma.test.create({
      data: {
        title: data.title,
        description: data.description,
        subject: data.subject,
        topic: data.topic,
        grade: data.grade,
        link: data.link,
        genreId: Number(data.genreId),
      },
    });
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
