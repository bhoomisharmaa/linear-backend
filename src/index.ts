import express, { Request, Response } from "express";
import issueRouter from "./routes/issues";
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use("/issues", issueRouter);
app.get("/", (req, res) => {
  res.send("Server is running");
});

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
app.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});

module.exports = app;
