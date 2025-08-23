import { NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma";
import { prisma } from "../../../../lib/prisma";


// GET : récupérer un produit
export async function GET(req, { params }) {
  const product = await prisma.product.findUnique({ where: { id: parseInt(params.id) } });
  return NextResponse.json(product);
}

// PUT : modifier un produit
export async function PUT(req, { params }) {
  const data = await req.json();
  const updated = await prisma.product.update({
    where: { id: parseInt(params.id) },
    data: { ...data, price: parseFloat(data.price) },
  });
  return NextResponse.json(updated);
}

// DELETE : supprimer un produit
export async function DELETE(req, { params }) {
  await prisma.product.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ message: "Deleted" });
}
