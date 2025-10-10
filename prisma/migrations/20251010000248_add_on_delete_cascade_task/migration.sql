-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_folderId_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
