CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "SlideStatus" AS ENUM ('editing', 'published', 'packed');
CREATE TYPE "UserRole" AS ENUM ('admin', 'editor', 'viewer');

CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "username" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "roles" "UserRole"[] NOT NULL DEFAULT ARRAY['viewer']::"UserRole"[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SystemVersion" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "systemName" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "SystemVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Slide" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT,
  "slideStructure" JSONB,
  "status" "SlideStatus" NOT NULL DEFAULT 'editing',
  "currentLockEmpName" TEXT,
  "lastPublishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "Slide_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Page" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "slideId" UUID NOT NULL,
  "pageType" INTEGER NOT NULL,
  "sortIndex" INTEGER NOT NULL DEFAULT 0,
  "mainContentStructure" JSONB NOT NULL,
  "gameId" TEXT,
  "gameTemplateId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Resource" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "fileMd5" TEXT NOT NULL,
  "cosFullPath" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "resourceType" TEXT NOT NULL,
  "resourceFormat" TEXT,
  "fileType" TEXT,
  "width" INTEGER,
  "height" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PageResourceRelation" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "pageId" UUID NOT NULL,
  "resourceId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "PageResourceRelation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Course" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "cityName" TEXT,
  "year" TEXT,
  "seasonName" TEXT,
  "gradeName" TEXT,
  "subjectName" TEXT,
  "bookVersionName" TEXT,
  "productTypeName" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LessonBinding" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "mainId" TEXT NOT NULL,
  "serialNumber" TEXT NOT NULL,
  "title" TEXT,
  "lessonInformation" TEXT,
  "slideId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "LessonBinding_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseTask" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "slideId" UUID NOT NULL,
  "pageId" UUID NOT NULL,
  "elementId" TEXT NOT NULL,
  "taskType" TEXT,
  "sortIndex" INTEGER NOT NULL DEFAULT 0,
  "taskExt" JSONB,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "CourseTask_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
CREATE UNIQUE INDEX "SystemVersion_systemName_key" ON "SystemVersion"("systemName");
CREATE INDEX "Slide_status_deletedAt_idx" ON "Slide"("status", "deletedAt");
CREATE INDEX "Slide_updatedAt_idx" ON "Slide"("updatedAt");
CREATE INDEX "Page_slideId_sortIndex_idx" ON "Page"("slideId", "sortIndex");
CREATE INDEX "Page_deletedAt_idx" ON "Page"("deletedAt");
CREATE UNIQUE INDEX "Resource_fileMd5_key" ON "Resource"("fileMd5");
CREATE INDEX "Resource_resourceType_deletedAt_idx" ON "Resource"("resourceType", "deletedAt");
CREATE UNIQUE INDEX "PageResourceRelation_pageId_resourceId_key" ON "PageResourceRelation"("pageId", "resourceId");
CREATE INDEX "PageResourceRelation_pageId_idx" ON "PageResourceRelation"("pageId");
CREATE INDEX "PageResourceRelation_resourceId_idx" ON "PageResourceRelation"("resourceId");
CREATE INDEX "Course_name_idx" ON "Course"("name");
CREATE INDEX "Course_year_gradeName_subjectName_idx" ON "Course"("year", "gradeName", "subjectName");
CREATE UNIQUE INDEX "LessonBinding_mainId_serialNumber_key" ON "LessonBinding"("mainId", "serialNumber");
CREATE INDEX "LessonBinding_slideId_idx" ON "LessonBinding"("slideId");
CREATE INDEX "CourseTask_slideId_taskType_idx" ON "CourseTask"("slideId", "taskType");
CREATE INDEX "CourseTask_pageId_elementId_idx" ON "CourseTask"("pageId", "elementId");
CREATE INDEX "CourseTask_deletedAt_idx" ON "CourseTask"("deletedAt");

ALTER TABLE "Page" ADD CONSTRAINT "Page_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "Slide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PageResourceRelation" ADD CONSTRAINT "PageResourceRelation_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PageResourceRelation" ADD CONSTRAINT "PageResourceRelation_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LessonBinding" ADD CONSTRAINT "LessonBinding_mainId_fkey" FOREIGN KEY ("mainId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LessonBinding" ADD CONSTRAINT "LessonBinding_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "Slide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseTask" ADD CONSTRAINT "CourseTask_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "Slide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CourseTask" ADD CONSTRAINT "CourseTask_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
