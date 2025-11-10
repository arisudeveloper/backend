-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
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
    "Leisure" BOOLEAN NOT NULL,
    "Role" TEXT NOT NULL DEFAULT 'subscriber',
    "Status" TEXT NOT NULL DEFAULT 'pending'
);
INSERT INTO "new_Users" ("Company", "Country", "Email", "First Name", "Fit", "Groups", "Guaranteed", "Last Name", "Leisure", "Mice", "Password", "Phone", "Role", "Username", "Whatsapp", "id") SELECT "Company", "Country", "Email", "First Name", "Fit", "Groups", "Guaranteed", "Last Name", "Leisure", "Mice", "Password", "Phone", "Role", "Username", "Whatsapp", "id" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_Email_key" ON "Users"("Email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
