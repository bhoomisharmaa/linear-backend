"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:3000",
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Express!");
});
async function createWorkspace(workspaceName) {
    const issue = await prisma.workspace.create({
        data: { workName: workspaceName },
    });
    return issue;
}
app.post("/workspace", async (req, res) => {
    try {
        const { workspaceName } = req.body;
        if (!workspaceName) {
            return res.status(400).send("workspaceName is required");
        }
        const issue = await createWorkspace(workspaceName);
        res.status(201).json(issue);
    }
    catch (error) {
        console.error("Error creating workspace:", error);
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
});
app.listen(3001, () => {
    console.log(`Server is running on port 3001`);
});
