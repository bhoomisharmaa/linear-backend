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
    console.error("Error fetching team:", error);
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

async function createTeam(team_name: string, identifier: string) {
  try {
    const workspace = await prisma.workspace.update({
      where: {
        id: 1,
      },
      data: {
        team: {
          create: {
            team_name,
            identifier,
          },
        },
      },
    });
    console.log(workspace);
  } catch (error) {
    console.log("Error creating team:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

router.post("/create-team", async (req: Request, res: Response) => {
  const { team_name, identifier } = req.body;
  if (!team_name || !identifier) {
    res.status(400).send("Team name and identifier are required");
  }
  try {
    await createTeam(team_name, identifier);
  } catch (error) {}
});

export default router;
