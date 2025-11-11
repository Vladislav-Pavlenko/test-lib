import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma/prisma";

export async function GET() {
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(genres);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const genre = await prisma.genre.create({ data: { name: data.name } });
    return NextResponse.json(genre);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
