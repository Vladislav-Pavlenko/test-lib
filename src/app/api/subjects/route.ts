import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma/prisma";

// GET — список всіх предметів
export async function GET() {
  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(subjects);
}

// POST — додати новий предмет
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: { name: data.name },
    });

    return NextResponse.json(subject);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

// PUT — редагувати предмет
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

    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: { name: data.name },
    });

    return NextResponse.json(updatedSubject);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

// DELETE — видалити предмет
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.subject.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
