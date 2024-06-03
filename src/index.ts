import { PrismaClient } from "@prisma/client";
import { time } from "console";
import express, { Request, Response } from "express";
const prisma = new PrismaClient();
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

async function getIssues() {
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
              status: "Todo",
            },
          }, // Include issues related to the team
        },
      },
    },
  });
  return issue[0].team[0].issues;
}

// app.post("/workspace", async (req, res) => {
//   try {
//     const { workspaceName } = req.body;
//     if (!workspaceName) {
//       return res.status(400).send("workspaceName is required");
//     }

//     const issue = await getIssues();
//     res.status(201).json(issue);
//   } catch (error) {
//     console.error("Error creating workspace:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error });
//   }
// });

app.get("/get-issues", async (req: Request, res: Response) => {
  try {
    const issues = await getIssues();
    res.status(201).json(issues);
  } catch (error) {
    console.error("Error creating workspace:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

app.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});
