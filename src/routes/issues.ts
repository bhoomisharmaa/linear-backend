import express, { Request, Response, Router } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { resolve } from "path";

const router = Router();
const prisma = new PrismaClient();

router.get("/", (req: Request, res: Response) => {
  res.send("issue router is working");
});

async function getIssues(issueStatus: string) {
  try {
    const issue = await prisma.workspace.findMany({
      where: {
        id: 1,
      },
      include: {
        team: {
          where: {
            team_index: 1, // Team index
          },
          include: {
            issues: {
              where: {
                status: issueStatus,
              },
            },
          },
        },
      },
    });
    console.log(issue[0].team[0].issues);
    return issue[0].team[0].issues;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

router.get("/get-issues/:status", async (req: Request, res: Response) => {
  try {
    const issueStatus = req.params.status;

    const issues = await getIssues(issueStatus);
    res.status(200).json(issues);
  } catch (error) {
    console.error("Error creating workspace:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

async function createWorkshop() {
  try {
    const workshop = await prisma.workspace.update({
      where: {
        id: 1,
      },
      data: {
        team: {
          update: [
            {
              where: {
                team_index: 1,
              },
              data: {
                issues: {
                  create: [
                    {
                      name: "WHEEEEEEEEEEEEEEEE",
                      createdAt: new Date(),
                      priority: "No",
                      status: "InProgress",
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    });
    console.log(workshop);
  } catch (error) {
    console.error("Error deleting workspace:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
// createWorkshop();
export default router;
