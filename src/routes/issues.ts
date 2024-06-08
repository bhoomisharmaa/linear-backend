import express, { Request, Response, Router } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { resolve } from "path";

const router = Router();
const prisma = new PrismaClient();

router.get("/", (req: Request, res: Response) => {
  res.send("issue router is working");
});

async function getIssues(issueStatus: string, team_index: number) {
  try {
    const issue = await prisma.workspace.findMany({
      where: {
        id: 1,
      },
      include: {
        team: {
          where: {
            team_index: team_index, // Team index
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
    return issue[0].team[0].issues;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

router.get(
  "/:team_index/get-issues/:status",
  async (req: Request, res: Response) => {
    try {
      const issueStatus = req.params.status;
      const team_index = req.params.team_index;

      const issues = await getIssues(issueStatus, parseInt(team_index));
      res.status(200).json(issues);
    } catch (error) {
      console.error("Error creating workspace:", error);
      res.status(500).json({ message: "Internal Server Error", error: error });
    }
  }
);

async function updateIssue(
  issueIndex: number,
  updateKey: keyof Prisma.IssuesUpdateInput,
  stuff: string,
  teamIndex: number
) {
  try {
    const data: Prisma.IssuesUpdateInput = {
      [updateKey]: stuff,
    };
    const issue = await prisma.workspace.update({
      where: {
        id: 1,
      },
      data: {
        team: {
          update: [
            {
              where: { team_index: teamIndex },
              data: {
                issues: {
                  update: [
                    {
                      where: { index: issueIndex },
                      data: data,
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    });
  } catch (error) {
    console.error("Error updating issue:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

router.post(
  "/update-issues/:teamIndex/:issueIndex",
  async (req: Request, res: Response) => {
    const { updateItem, updateKey } = req.body;
    const issueIndex = req.params.issueIndex;
    const teamIndex = req.params.teamIndex;
    if (!issueIndex || !updateKey) {
      return res
        .status(400)
        .send("updateItem, issueIndex, and updateKey are required");
    }

    try {
      await updateIssue(
        parseInt(issueIndex),
        updateKey,
        updateItem,
        parseInt(teamIndex)
      );
      res.status(200).send("Issue updated successfully");
    } catch (error) {
      console.error("Error updating issue:", error);
      res.status(500).send("Error updating issue");
    }
  }
);

async function createIssues(
  data: Prisma.IssuesCreateInput,
  team_index: number
) {
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
                team_index: team_index,
              },
              data: {
                issues: {
                  create: [data],
                },
              },
            },
          ],
        },
      },
    });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
router.post(
  "/:team_index/create-issues",
  async (req: Request, res: Response) => {
    const { data } = req.body;
    const team_index = req.params.team_index;
    if (!data) {
      return res
        .status(400)
        .send("updateItem, issueIndex, and updateKey are required");
    }

    try {
      await createIssues(data, parseInt(team_index));
      res.status(200).send("Issue created successfully");
    } catch (error) {
      console.error("Error creating issue:", error);
      res.status(500).send("Error creating issue");
    }
  }
);
// createWorkshop();
export default router;
