DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'publishing'
      AND enumtypid = '"SlideStatus"'::regtype
  ) THEN
    ALTER TYPE "SlideStatus" ADD VALUE 'publishing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'publish_failed'
      AND enumtypid = '"SlideStatus"'::regtype
  ) THEN
    ALTER TYPE "SlideStatus" ADD VALUE 'publish_failed';
  END IF;
END $$;

CREATE TYPE "PublishStatus" AS ENUM ('publishing', 'success', 'failed');

ALTER TABLE "Slide" ADD COLUMN "currentPublishId" UUID;

CREATE TABLE "SlidePublishRecord" (
  "id" UUID NOT NULL,
  "slideId" UUID NOT NULL,
  "version" INTEGER NOT NULL,
  "status" "PublishStatus" NOT NULL,
  "slideSnapshot" JSONB NOT NULL,
  "manifest" JSONB,
  "manifestOssPath" TEXT,
  "packageOssPath" TEXT,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SlidePublishRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PagePublishSnapshot" (
  "id" UUID NOT NULL,
  "publishRecordId" UUID NOT NULL,
  "pageId" UUID NOT NULL,
  "pageType" INTEGER NOT NULL,
  "sortIndex" INTEGER NOT NULL,
  "pageSnapshot" JSONB NOT NULL,
  "resources" JSONB,
  "screenshotOssPath" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PagePublishSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SlidePublishRecord_slideId_version_key" ON "SlidePublishRecord"("slideId", "version");
CREATE INDEX "SlidePublishRecord_slideId_status_idx" ON "SlidePublishRecord"("slideId", "status");
CREATE INDEX "SlidePublishRecord_createdAt_idx" ON "SlidePublishRecord"("createdAt");
CREATE UNIQUE INDEX "PagePublishSnapshot_publishRecordId_pageId_key" ON "PagePublishSnapshot"("publishRecordId", "pageId");
CREATE INDEX "PagePublishSnapshot_publishRecordId_sortIndex_idx" ON "PagePublishSnapshot"("publishRecordId", "sortIndex");
CREATE INDEX "PagePublishSnapshot_pageId_idx" ON "PagePublishSnapshot"("pageId");
CREATE INDEX "Slide_currentPublishId_idx" ON "Slide"("currentPublishId");

ALTER TABLE "SlidePublishRecord" ADD CONSTRAINT "SlidePublishRecord_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "Slide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PagePublishSnapshot" ADD CONSTRAINT "PagePublishSnapshot_publishRecordId_fkey" FOREIGN KEY ("publishRecordId") REFERENCES "SlidePublishRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Slide" ADD CONSTRAINT "Slide_currentPublishId_fkey" FOREIGN KEY ("currentPublishId") REFERENCES "SlidePublishRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
