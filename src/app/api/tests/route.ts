import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters: any = {};

    // Фільтр по назві тесту
    const title = searchParams.get("title") || "";
    if (title) filters.title = { contains: title, mode: "insensitive" };

    // Фільтр по предмету
    const subjectId = Number(searchParams.get("subject"));
    if (!isNaN(subjectId) && subjectId > 0) filters.subjectId = subjectId;

    // Фільтр по класу
    const grade = Number(searchParams.get("grade"));
    if (!isNaN(grade) && grade > 0) filters.grade = grade;

    // Фільтр по автору
    const authorId = Number(searchParams.get("authorId"));
    if (!isNaN(authorId) && authorId > 0) filters.authorId = authorId;

    const tests = await prisma.test.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: { subjectRel: true, author: true }, // включаємо відношення
    });

    return NextResponse.json(tests || []);
  } catch (err) {
    console.error("Помилка GET /api/tests:", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Перевірка обов'язкових полів
    if (!data.title || !data.link || !data.subjectId) {
      return NextResponse.json(
        { error: "title, link та subjectId обов'язкові" },
        { status: 400 },
      );
    }

    const test = await prisma.test.create({
      data: {
        title: data.title,
        description: data.description || "",
        topic: data.topic || "",
        grade: data.grade || 1,
        link: data.link,
        subjectId: Number(data.subjectId),
        authorId: data.authorId ? Number(data.authorId) : undefined,
      },
      include: {
        subjectRel: true,
        author: true,
      },
    });

    return NextResponse.json(test);
  } catch (err) {
    console.error("Помилка POST /api/tests:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const id = Number(data.id);
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updatedTest = await prisma.test.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        topic: data.topic,
        grade: data.grade,
        link: data.link,
        subjectId: data.subjectId ? Number(data.subjectId) : undefined,
        authorId: data.authorId ? Number(data.authorId) : undefined,
      },
      include: {
        subjectRel: true,
        author: true,
      },
    });

    return NextResponse.json(updatedTest);
  } catch (err) {
    console.error("Помилка PUT /api/tests:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.test.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Помилка DELETE /api/tests:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
