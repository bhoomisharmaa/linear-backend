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

async function updateIssue(
  issueIndex: number,
  updateKey: keyof Prisma.IssuesUpdateInput,
  stuff: string
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
              where: { team_index: 1 },
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
  "/update-issues/:issueIndex",
  async (req: Request, res: Response) => {
    const { updateItem, updateKey } = req.body;
    const { issueIndex } = req.params;
    if (!issueIndex || !updateKey) {
      return res
        .status(400)
        .send("updateItem, issueIndex, and updateKey are required");
    }

    try {
      await updateIssue(parseInt(issueIndex), updateKey, updateItem);
      res.status(200).send("Issue updated successfully");
    } catch (error) {
      console.error("Error updating issue:", error);
      res.status(500).send("Error updating issue");
    }
  }
);

async function createIssues(data: Prisma.IssuesCreateInput) {
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
router.post("/create-issues", async (req: Request, res: Response) => {
  const { data } = req.body;
  if (!data) {
    return res
      .status(400)
      .send("updateItem, issueIndex, and updateKey are required");
  }

  try {
    await createIssues(data);
    res.status(200).send("Issue created successfully");
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).send("Error creating issue");
  }
});
// createWorkshop();
export default router;
