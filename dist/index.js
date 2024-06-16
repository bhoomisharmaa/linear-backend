"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors = require("cors");
const issueRouter = require("./issues");
const teamRouter = require("./team");
app.use(cors({
    origin: "http://localhost:3000",
}));
app.use(express_1.default.json());
app.use("/issues", issueRouter);
app.use("/teams", teamRouter);
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.listen(3001, () => {
    console.log(`Server is running on port 3001`);
});
module.exports = app;
