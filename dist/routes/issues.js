"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/", (req, res) => {
    res.send("issue router is working");
});
async function getIssues(team_index, issueStatus) {
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
    }
    catch (error) {
        console.error("Error fetching issues:", error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
router.get("/:team_index/get-issues/:status?", async (req, res) => {
    try {
        const issueStatus = req.params.status;
        const team_index = req.params.team_index;
        if (!team_index) {
            res.status(404).send("Team Index is required to fetch issues");
        }
        const issues = await getIssues(parseInt(team_index), issueStatus);
        res.status(200).json(issues);
    }
    catch (error) {
        console.error("Error creating workspace:", error);
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
});
async function updateIssue(issueIndex, data, teamIndex) {
    try {
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
                                            data,
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                },
            },
        });
    }
    catch (error) {
        console.error("Error updating issue:", error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
router.post("/update-issues/:teamIndex/:issueIndex", async (req, res) => {
    const issueIndex = req.params.issueIndex;
    const teamIndex = req.params.teamIndex;
    const { data } = req.body;
    if (!issueIndex || !teamIndex) {
        return res.status(400).send("issueIndex, and updateKey are required");
    }
    try {
        await updateIssue(parseInt(issueIndex), data, parseInt(teamIndex));
        res.status(200).send("Issue updated successfully");
    }
    catch (error) {
        console.error("Error updating issue:", error);
        res.status(500).send("Error updating issue");
    }
});
async function createIssues(data, team_index) {
    try {
        await prisma.workspace.update({
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
    }
    catch (error) {
        console.error("Error creating issue:", error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
router.post("/:team_index/create-issues", async (req, res) => {
    const { data } = req.body;
    const team_index = req.params.team_index;
    if (!data || !team_index) {
        return res.status(400).send("data and team index are required");
    }
    try {
        await createIssues(data, parseInt(team_index));
        res.status(200).send("Issue created successfully");
    }
    catch (error) {
        console.error("Error creating issue:", error);
        res.status(500).send("Error creating issue");
    }
});
async function deleteIssue(issueIndex, teamIndex) {
    try {
        await prisma.issues.delete({
            where: {
                index: issueIndex,
                AND: { teamIndex },
            },
        });
    }
    catch (error) {
        console.log("Error deleting issue:", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
router.delete("/:teamIndex/deleteIssue/:issueIndex", async (req, res) => {
    const issueIndex = req.params.issueIndex;
    const teamIndex = req.params.teamIndex;
    if (!teamIndex || !issueIndex) {
        res.status(404).send("Team index and issue index are required");
    }
    try {
        await deleteIssue(parseInt(issueIndex), parseInt(teamIndex));
        res.status(200).send("Issue deleted successfully");
    }
    catch (error) {
        res.status(500).send("Error deleting issue");
    }
});
exports.default = router;
