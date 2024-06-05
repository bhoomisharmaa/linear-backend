import express, { Request, Response, Router } from "express";
import { PrismaClient, Prisma, $Enums } from "@prisma/client";
import { resolve } from "path";

const router = Router();
const prisma = new PrismaClient();

router.get("/", (req: Request, res: Response) => {
  res.send("issue router is working");
});

async function getIssues(
  issueStatus: Prisma.EnumStatusFilter<"Issues"> | $Enums.Status
) {
  const issue = await prisma.workspace.findMany({
    where: {
      id: 1,
    },
    include: {
      team: {
        where: {
          team_index: 1, // Team name
        },
        include: {
          issues: {
            where: {
              status: issueStatus,
            },
          }, // Include issues related to the team
        },
      },
    },
  });
  return issue[0].team[0].issues;
}

router.get("/get-todo", async (req: Request, res: Response) => {
  try {
    const { issueStatus } = req.body;
    const issues = await getIssues(issueStatus);
    res.status(201).json(issues);
  } catch (error) {
    console.error("Error creating workspace:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

export default router;
