import express, { Request, Response, Router } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { resolve } from "path";

const router = Router();
const prisma = new PrismaClient();

router.get("/", (req: Request, res: Response) => {
  res.send("team router is working");
});

async function getTeam() {
  try {
    const workspace = await prisma.workspace.findMany({
      where: {
        workName: "Bhoomi",
      },
      include: {
        team: {},
      },
    });
    return workspace[0].team;
  } catch (error) {
    console.error("Error updating issue:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

router.get("/get-team", async (req: Request, res: Response) => {
  try {
    const team = await getTeam();
    res.status(200).json(team);
  } catch (error) {
    res.status(500).send("Error fetching team");
  }
});

export default router;
