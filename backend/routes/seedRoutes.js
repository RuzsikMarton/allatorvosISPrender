import express, {request, response} from "express";
import User from "../models/userModel.js";
import data from "../data.js";
import Animal from "../models/animalModel.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
    try {
        await User.deleteMany({});
        const createdUser = await User.insertMany(data.users);
        res.send({ createdUser });
    } catch (error) {
        console.error("Error seeding database:", error);
        res.status(500).send("Error seeding database");
    }
});


export default seedRouter;