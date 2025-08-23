import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET : récupérer tous les produits
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}
