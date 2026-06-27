-- AlterTable
ALTER TABLE "products" ADD COLUMN     "display_order" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "file_url" VARCHAR(512) NOT NULL,
    "project_name" VARCHAR(100) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);
