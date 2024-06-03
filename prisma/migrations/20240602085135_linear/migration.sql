-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Todo', 'InProgress', 'Backlog', 'Canceled', 'Duplicate');

-- CreateEnum
CREATE TYPE "Priorities" AS ENUM ('No', 'Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "Labels" AS ENUM ('Bug', 'Feature', 'Improvement');

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
    "workspaceId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_index")
);

-- CreateTable
CREATE TABLE "Issues" (
    "index" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Todo',
    "priority" "Priorities" NOT NULL DEFAULT 'No',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assingedTo" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "label" "Labels" NOT NULL,
    "teamIndex" INTEGER NOT NULL,

    CONSTRAINT "Issues_pkey" PRIMARY KEY ("index")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_team_name_key" ON "Team"("team_name");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_teamIndex_fkey" FOREIGN KEY ("teamIndex") REFERENCES "Team"("team_index") ON DELETE RESTRICT ON UPDATE CASCADE;
