/*
  Warnings:

  - You are about to drop the column `columnId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_columnId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "columnId";

-- CreateTable
CREATE TABLE "ColumnTask" (
    "id" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ColumnTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ColumnTask_columnId_taskId_key" ON "ColumnTask"("columnId", "taskId");

-- AddForeignKey
ALTER TABLE "ColumnTask" ADD CONSTRAINT "ColumnTask_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnTask" ADD CONSTRAINT "ColumnTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
