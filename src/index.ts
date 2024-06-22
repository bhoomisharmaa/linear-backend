import express, { Request, Response } from "express";
import issueRouter from "./routes/issues";
import teamRouter from "./routes/team";
import { Prisma, PrismaClient } from "@prisma/client";
const app = express();
const prisma = new PrismaClient();

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use("/issues", issueRouter);
app.use("/teams", teamRouter);
app.get("/", (req, res) => {
  res.send("Server is running");
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function getWorkspaceName() {
  try {
    const work = await prisma.workspace.findMany({
      where: {
        workName: "Tierra",
      },
    });
  } catch (error) {
    console.log("Error creating workshop", error);
  } finally {
    await prisma.$disconnect();
  }
}

app.get("/get-workspace");

module.exports = app;
