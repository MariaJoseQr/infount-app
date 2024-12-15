/*
  Warnings:

  - You are about to drop the column `thesisAmount` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `thesisTypeId` on the `Procedure` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Procedure` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Procedure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chargeIds` to the `Procedure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Procedure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Procedure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thesisTypeIds` to the `Procedure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Procedure` DROP FOREIGN KEY `Procedure_thesisTypeId_fkey`;

-- AlterTable
ALTER TABLE `Procedure` DROP COLUMN `thesisAmount`,
    DROP COLUMN `thesisTypeId`,
    ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `chargeIds` VARCHAR(191) NOT NULL,
    ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `thesisTypeIds` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Procedure_code_key` ON `Procedure`(`code`);
