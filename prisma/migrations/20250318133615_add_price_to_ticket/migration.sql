/*
  Warnings:

  - You are about to drop the column `canceled` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `expired` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `repayed` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `used` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `location` to the `Concert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTickets` to the `Concert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('CREATED', 'USED', 'REFUNDED', 'CANCELED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Concert" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "maxTickets" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "canceled",
DROP COLUMN "expired",
DROP COLUMN "repayed",
DROP COLUMN "used",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'CREATED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
