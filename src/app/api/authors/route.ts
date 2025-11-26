import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma/prisma";

// GET — список авторів
export async function GET() {
  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(authors);
}

// POST — додати нового автора
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const author = await prisma.author.create({
      data: { name: data.name },
    });

    return NextResponse.json(author);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

// PUT — редагувати автора
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const id = Number(data.id);
    if (!id || !data.name) {
      return NextResponse.json(
        { error: "ID and name are required" },
        { status: 400 },
      );
    }

    const updatedAuthor = await prisma.author.update({
      where: { id },
      data: { name: data.name },
    });

    return NextResponse.json(updatedAuthor);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

// DELETE — видалити автора
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.author.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
