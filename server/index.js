const express = require("express");
const { MongoClient } = require("mongodb");
require('dotenv').config();

const PORT = process.env.PORT;
const uri = process.env.MONGODB_URI;

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

const client = new MongoClient(uri);

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

// API: Retrieve user by userID
app.get("/users/:userID", async (req, res) => {
    try {
        const userID = req.params.userID;
        const database = client.db("InSiteDatabase");
        const users = database.collection("Users");

        const user = await users.findOne({ userID });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// API: Add feedback object to feedbackData of a user
app.post("/users/:userID/feedback", async (req, res) => {
    try {
        const userID = req.params.userID;
        const feedbackObject = req.body; // Expecting feedbackObject from request body

        const database = client.db("InSiteDatabase");
        const users = database.collection("Users");

        // Update user's feedbackData array with the new feedbackObject
        const result = await users.updateOne(
            { userID },
            { $push: { feedbackData: feedbackObject } }
        );

        if (result.matchedCount > 0) {
            res.status(200).json({ message: "Feedback added successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server listening on port ${PORT}`);
});
