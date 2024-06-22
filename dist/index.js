"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const issues_1 = __importDefault(require("./routes/issues"));
const team_1 = __importDefault(require("./routes/team"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:3000",
}));
app.use(express_1.default.json());
app.use("/issues", issues_1.default);
app.use("/teams", team_1.default);
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
    }
    catch (error) {
        console.log("Error creating workshop", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
app.get("/get-workspace");
module.exports = app;
