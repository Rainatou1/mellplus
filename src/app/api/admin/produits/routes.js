import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


export async function POST(req) {
  const { name, description, price, categoryId } = await req.json();
  const product = await prisma.product.create({
    data: { name, description, price, categoryId: parseInt(categoryId) },
  });
  return NextResponse.json(product);
}
