/*
  Warnings:

  - You are about to drop the column `barcode` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Product_sku_idx";

-- DropIndex
DROP INDEX "public"."Product_sku_key";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "barcode",
DROP COLUMN "sku";
