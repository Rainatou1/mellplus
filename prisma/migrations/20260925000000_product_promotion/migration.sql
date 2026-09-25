BEGIN;

-- Additive only: preserve every existing column, including publishedAt/updatedAt.
ALTER TABLE "public"."Product"
ADD COLUMN "isPromotion" BOOLEAN NOT NULL DEFAULT false;

-- Preserve the old promotion classification once, including unpublished drafts.
-- Publication remains exclusively controlled by publishedAt.
UPDATE "public"."Product"
SET "isPromotion" = true
WHERE "discount" > 0;

COMMIT;
