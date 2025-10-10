-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_folderId_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "folderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
