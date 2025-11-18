-- CreateEnum
CREATE TYPE "public"."ProductCategory" AS ENUM ('INFORMATIQUE', 'TELEPHONIE', 'CLIMATISATION', 'BUREAUTIQUE', 'GAMING', 'RESEAU', 'SECURITE', 'ENERGIE', 'ACCESSOIRES');

-- CreateEnum
CREATE TYPE "public"."ServiceCategory" AS ENUM ('VENTE_MATERIEL', 'INSTALLATION', 'MAINTENANCE', 'FORMATION', 'CONSEIL', 'DEVELOPPEMENT', 'RESEAU', 'SECURITE');

-- CreateEnum
CREATE TYPE "public"."PricingType" AS ENUM ('FIXED', 'HOURLY', 'CUSTOM', 'PACKAGE');

-- CreateEnum
CREATE TYPE "public"."QuoteType" AS ENUM ('PRODUCT', 'SERVICE', 'MIXED');

-- CreateEnum
CREATE TYPE "public"."QuoteStatus" AS ENUM ('PENDING', 'REVIEWING', 'QUOTED', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT');

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "category" "public"."ProductCategory" NOT NULL,
    "subcategory" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "sku" TEXT,
    "barcode" TEXT,
    "image" TEXT,
    "images" TEXT[],
    "specifications" JSONB,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "lowStock" INTEGER NOT NULL DEFAULT 5,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "discount" INTEGER,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" TEXT,
    "category" "public"."ServiceCategory" NOT NULL,
    "features" TEXT[],
    "benefits" TEXT[],
    "process" TEXT[],
    "pricing" "public"."PricingType" NOT NULL DEFAULT 'CUSTOM',
    "basePrice" DECIMAL(10,2),
    "priceNote" TEXT,
    "icon" TEXT,
    "image" TEXT,
    "gallery" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuoteRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "address" TEXT,
    "city" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "budget" TEXT,
    "deadline" TIMESTAMP(3),
    "type" "public"."QuoteType" NOT NULL DEFAULT 'SERVICE',
    "serviceId" TEXT,
    "status" "public"."QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "public"."Priority" NOT NULL DEFAULT 'NORMAL',
    "assignedTo" TEXT,
    "responseAt" TIMESTAMP(3),
    "response" TEXT,
    "quotePdf" TEXT,
    "validUntil" TIMESTAMP(3),
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuoteItem" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "productId" TEXT,
    "customItem" TEXT,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2),
    "totalPrice" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "source" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "starred" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "role" "public"."AdminRole" NOT NULL DEFAULT 'MODERATOR',
    "permissions" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "lastLogin" TIMESTAMP(3),
    "lastIp" TEXT,
    "resetToken" TEXT,
    "resetExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminActivity" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "siteName" TEXT NOT NULL DEFAULT 'Mell Plus Niger',
    "tagline" TEXT,
    "description" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "youtube" TEXT,
    "openingHours" JSONB,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[],
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "googleAnalytics" TEXT,
    "facebookPixel" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "subscribed" BOOLEAN NOT NULL DEFAULT true,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "ip" TEXT,
    "unsubscribeToken" TEXT,
    "verifyToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "public"."Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "public"."Product"("sku");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "public"."Product"("category");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "public"."Product"("slug");

-- CreateIndex
CREATE INDEX "Product_sku_idx" ON "public"."Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "public"."Service"("slug");

-- CreateIndex
CREATE INDEX "Service_category_idx" ON "public"."Service"("category");

-- CreateIndex
CREATE INDEX "Service_slug_idx" ON "public"."Service"("slug");

-- CreateIndex
CREATE INDEX "QuoteRequest_status_idx" ON "public"."QuoteRequest"("status");

-- CreateIndex
CREATE INDEX "QuoteRequest_email_idx" ON "public"."QuoteRequest"("email");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "public"."Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_read_idx" ON "public"."Contact"("read");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "public"."Session"("token");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "public"."Session"("token");

-- CreateIndex
CREATE INDEX "Session_adminId_idx" ON "public"."Session"("adminId");

-- CreateIndex
CREATE INDEX "AdminActivity_adminId_idx" ON "public"."AdminActivity"("adminId");

-- CreateIndex
CREATE INDEX "AdminActivity_entity_idx" ON "public"."AdminActivity"("entity");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_email_key" ON "public"."Newsletter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_unsubscribeToken_key" ON "public"."Newsletter"("unsubscribeToken");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_verifyToken_key" ON "public"."Newsletter"("verifyToken");

-- CreateIndex
CREATE INDEX "Newsletter_email_idx" ON "public"."Newsletter"("email");

-- AddForeignKey
ALTER TABLE "public"."QuoteRequest" ADD CONSTRAINT "QuoteRequest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuoteItem" ADD CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuoteItem" ADD CONSTRAINT "QuoteItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdminActivity" ADD CONSTRAINT "AdminActivity_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
