CREATE TABLE "SubmissionGuard" ("key" TEXT PRIMARY KEY, "count" INTEGER NOT NULL, "expiresAt" TIMESTAMPTZ(3) NOT NULL);
CREATE INDEX "SubmissionGuard_expiresAt_idx" ON "SubmissionGuard" ("expiresAt");
