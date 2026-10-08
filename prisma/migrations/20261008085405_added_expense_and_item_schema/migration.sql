-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_name_key" ON "items"("name");

-- CreateIndex
CREATE INDEX "expenses_itemId_idx" ON "expenses"("itemId");

-- CreateIndex
CREATE INDEX "expenses_date_idx" ON "expenses"("date");

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
