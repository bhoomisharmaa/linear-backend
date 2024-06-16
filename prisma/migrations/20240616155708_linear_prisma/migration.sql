-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Todo', 'InProgress', 'Done', 'Backlog', 'Canceled', 'Duplicate');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('No', 'Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "Label" AS ENUM ('Bug', 'Improvement', 'Performance');

-- CreateTable
CREATE TABLE "Workspace" (
    "id" SERIAL NOT NULL,
    "workName" TEXT NOT NULL DEFAULT 'Bhoomi',

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "team_index" SERIAL NOT NULL,
    "team_name" TEXT NOT NULL,
    "identifier" TEXT,
    "workspaceId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_index")
);

-- CreateTable
CREATE TABLE "Issues" (
    "index" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT DEFAULT 'Todo',
    "priority" TEXT DEFAULT 'No',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT,
    "teamIndex" INTEGER NOT NULL,
    "usersUserId" TEXT,
    "projectsIndex" TEXT,

    CONSTRAINT "Issues_pkey" PRIMARY KEY ("index")
);

-- CreateTable
CREATE TABLE "Projects" (
    "index" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("index")
);

-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "issueIndex" INTEGER NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_team_name_key" ON "Team"("team_name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_projectsIndex_fkey" FOREIGN KEY ("projectsIndex") REFERENCES "Projects"("index") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_teamIndex_fkey" FOREIGN KEY ("teamIndex") REFERENCES "Team"("team_index") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_usersUserId_fkey" FOREIGN KEY ("usersUserId") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
