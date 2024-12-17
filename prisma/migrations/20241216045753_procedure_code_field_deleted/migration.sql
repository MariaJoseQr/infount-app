/*
  Warnings:

  - You are about to drop the column `code` on the `Procedure` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Procedure_code_key` ON `Procedure`;

-- AlterTable
ALTER TABLE `Procedure` DROP COLUMN `code`;
