-- sqlite3 dump.sql
BEGIN TRANSACTION;

-- CreateTable
CREATE TABLE "Templates" (
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE,
    "template" BINARY NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- CreateIndex
CREATE UNIQUE INDEX "Templates_id_key" ON "Templates"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Templates_name_key" ON "Templates"("name");

-- end of dump
COMMIT;