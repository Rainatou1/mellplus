import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}

export async function POST(req) {
  const { name, parentId } = await req.json();
  const category = await prisma.category.create({
    data: { name, parentId: parentId || null },
  });
  return NextResponse.json(category);
}
