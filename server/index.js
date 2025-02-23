const express = require("express");
const { MongoClient } = require("mongodb");
require('dotenv').config();

const PORT = process.env.PORT;
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
const collectionName = process.env.MONGODB_COLLECTION_NAME;

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

// Function to generate a random API key with a mix of uppercase, lowercase, and numbers
function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return [...Array(16)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// API: Create a new user
app.post("/users", async (req, res) => {
    try {
        const { userID, resolvedAmount, feedbackData } = req.body;
        const apiKey = generateApiKey();
        const database = client.db(dbName);
        const users = database.collection(collectionName);

        const newUser = {
            userID,
            apiKey,
            resolvedAmount,
            feedbackData,
            formSettings: {
                theme: "dark",
                formTitle: "Feedback Form",
                formDescription: "Please provide feedback below.",
            }
        };

        const result = await users.insertOne(newUser);

        if (result.acknowledged) {
            res.status(201).json({ message: "User created successfully", apiKey });
        } else {
            res.status(500).json({ message: "Failed to create user" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// API: Retrieve user by userID
app.get("/users/:userID", async (req, res) => {
    try {
        const userID = req.params.userID;
        const database = client.db(dbName);
        const users = database.collection(collectionName);

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

// API: Retrieve user form settings by API key
app.get("/userSettings/:apiKey", async (req, res) => {
    try {

        const apiKey = req.params.apiKey;
        const database = client.db(dbName);
        const users = database.collection(collectionName);

        const user = await users.findOne({ apiKey });

        if (user) {
            res.status(200).json(user.formSettings);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// API: Add feedback object to feedbackData of a user by API key
app.post("/users/feedback/:apiKey", async (req, res) => {
    try {
        const apiKey = req.params.apiKey;
        const { name, email, category, rating, message } = req.body;
        const dateSubmitted = new Date().toISOString();

        const feedbackObject = { name, email, category, rating, message, dateSubmitted };

        const database = client.db(dbName);
        const users = database.collection(collectionName);

        // Update user's feedbackData array with the new feedbackObject
        const result = await users.updateOne(
            { apiKey },
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

//API: Delete feedback object from feedbackData of a user by passing in the index of feedbackID
app.delete("/users/:userID/feedback/:index", async (req, res) => {
    try {
        const userID = req.params.userID;
        const index = parseInt(req.params.index);
        const database = client.db(dbName);
        const users = database.collection(collectionName);

        // Remove feedback object from feedbackData array by index and increment resolvedAmount
        const result = await users.updateOne(
            { userID },
            {
                $unset: { [`feedbackData.${index}`]: 1 },
                $inc: { resolvedAmount: 1 }
            }
        );

        if (result.matchedCount > 0) {
            // Remove the null value from the array
            await users.updateOne(
                { userID },
                { $pull: { feedbackData: null } }
            );
            res.status(200).json({ message: "Feedback deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// API: Delete all feedbackData for a user
app.delete("/users/:userID/feedback", async (req, res) => {
    try {
        const userID = req.params.userID;
        const database = client.db(dbName);
        const users = database.collection(collectionName);

        // First get the current feedback count
        const user = await users.findOne({ userID });
        const feedbackCount = user?.feedbackData?.length || 0;

        // Remove all feedbackData and update resolvedAmount
        const result = await users.updateOne(
            { userID },
            {
                $set: { feedbackData: [] },
                $inc: { resolvedAmount: feedbackCount }
            }
        );

        if (result.matchedCount > 0) {
            res.status(200).json({
                message: "All feedback deleted successfully",
                resolvedCount: feedbackCount
            });
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

        const database = client.db(dbName);
        const users = database.collection(collectionName);

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

// API: Update form settings by userID
app.put("/users/:userID/formSettings", async (req, res) => {
    try {
        const userID = req.params.userID;
        const { theme, formTitle, formDescription } = req.body;
        const database = client.db(dbName);
        const users = database.collection(collectionName);

        const result = await users.updateOne(
            { userID },
            {
                $set: {
                    formSettings: {
                        theme,
                        formTitle,
                        formDescription
                    }
                }
            }
        );

        if (result.matchedCount > 0) {
            res.status(200).json({ message: "Form settings updated successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// API: Delete user by userID
app.delete("/users/:userID", async (req, res) => {
    try {
        const userID = req.params.userID;
        const database = client.db(dbName);
        const users = database.collection(collectionName);

        const result = await users.deleteOne({ userID });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Start the server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server listening on port ${PORT}`);
});
