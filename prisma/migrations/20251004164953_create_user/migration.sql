-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "First Name" TEXT NOT NULL,
    "Last Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Company" TEXT,
    "Country" TEXT NOT NULL,
    "Phone" TEXT,
    "Whatsapp" TEXT,
    "Mice" BOOLEAN NOT NULL,
    "Fit" BOOLEAN NOT NULL,
    "Groups" BOOLEAN NOT NULL,
    "Guaranteed" BOOLEAN NOT NULL,
    "Leisure" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_Email_key" ON "Users"("Email");
