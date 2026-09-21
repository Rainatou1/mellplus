-- Carousel existait dans schema.prisma, sans migration versionnée.
-- IF NOT EXISTS conserve les tables et données déjà créées via db push.
CREATE TABLE IF NOT EXISTS "public"."Carousel" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "description" TEXT,
  "image" TEXT NOT NULL,
  "ctaPrimary" TEXT,
  "ctaSecondary" TEXT,
  "linkPrimary" TEXT,
  "linkSecondary" TEXT,
  "bgGradient" TEXT NOT NULL DEFAULT 'from-blue-600 to-blue-800',
  "textColor" TEXT NOT NULL DEFAULT 'text-white',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdBy" TEXT,
  CONSTRAINT "Carousel_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Carousel_active_idx" ON "public"."Carousel"("active");
CREATE INDEX IF NOT EXISTS "Carousel_order_idx" ON "public"."Carousel"("order");

CREATE TABLE IF NOT EXISTS "public"."VisualBlock" (
  "key" TEXT NOT NULL,
  "image" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "alt" TEXT,
  "link" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VisualBlock_pkey" PRIMARY KEY ("key")
);
