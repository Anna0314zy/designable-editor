CREATE TYPE "PublishJobStatus" AS ENUM ('pending', 'running', 'success', 'failed');

CREATE TABLE "PublishJob" (
  "id" UUID NOT NULL,
  "slideId" UUID NOT NULL,
  "publishRecordId" UUID NOT NULL,
  "status" "PublishJobStatus" NOT NULL DEFAULT 'pending',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "maxAttempts" INTEGER NOT NULL DEFAULT 3,
  "nextRunAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lockedAt" TIMESTAMP(3),
  "lockedBy" TEXT,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PublishJob_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PublishJob_publishRecordId_key" ON "PublishJob"("publishRecordId");
CREATE INDEX "PublishJob_status_nextRunAt_idx" ON "PublishJob"("status", "nextRunAt");
CREATE INDEX "PublishJob_slideId_status_idx" ON "PublishJob"("slideId", "status");
CREATE INDEX "PublishJob_lockedAt_idx" ON "PublishJob"("lockedAt");

ALTER TABLE "PublishJob" ADD CONSTRAINT "PublishJob_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "Slide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PublishJob" ADD CONSTRAINT "PublishJob_publishRecordId_fkey" FOREIGN KEY ("publishRecordId") REFERENCES "SlidePublishRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
