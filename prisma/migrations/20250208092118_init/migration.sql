-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "auth_provider_user_id" INTEGER NOT NULL,
    "auth_provider" TEXT NOT NULL DEFAULT 'github',
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
