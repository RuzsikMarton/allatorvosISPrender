import express from "express";
import {isAdmin, isAuth, isEmployee} from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Animal from "../models/animalModel.js";
import User from "../models/userModel.js";

const animalRouter = express.Router();

const PAGE_SIZE = 10;


animalRouter.get(
    '/',
    isAuth,
    isEmployee,
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || PAGE_SIZE;
        const animals = await Animal.find({}).populate('owner').skip(pageSize * (page - 1))
            .limit(pageSize);
        const countAnimals = await Animal.countDocuments();
        res.send({
            animals,
            countAnimals,
            page,
            pages: Math.ceil(countAnimals / pageSize),
        });
    })
);

animalRouter.post(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const newAnimal = new Animal({
            name: req.body.name,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            breed: req.body.breed,
            subBreed: req.body.subBreed,
            color: req.body.color,
            owner: req.user._id,
        });

        const animals = await newAnimal.save();
        res.status(201).send({ message: 'New Animal Created', animals });
    })
);


animalRouter.get(
    '/mine',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const animals = await Animal.find({ owner: req.user._id });
        res.send(animals);
    })
);


animalRouter.get(
    '/owner/:id',
    isAuth,
    isEmployee,
    expressAsyncHandler(async (req, res) => {
        const userId = req.params.id;
        const animals = await Animal.find({ owner: userId }).populate('owner');
        res.send(animals);
    })
);

animalRouter.get(
    '/summary',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const animals = await Animal.aggregate([
            {
                $group: {
                    _id: null,
                    numAnimals: { $sum: 1 },
                },
            },
        ]);

        const users = await User.aggregate([
            {
                $group: {
                    _id: { $cond: { if: "$isEmployee", then: "Employee", else: "Regular User" } },
                    count: { $sum: 1 },
                },
            },
        ]);

        const userCounts = {
            regularUsers: 0,
            employees: 0
        };

        users.forEach(userGroup => {
            if (userGroup._id === "Regular User") {
                userCounts.regularUsers = userGroup.count;
            } else if (userGroup._id === "Employee") {
                userCounts.employees = userGroup.count;
            }
        });

        res.send({ userCounts, animals });
    })
);


animalRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const animal = await Animal.findById(req.params.id).populate('owner');
        if (animal) {
            res.send(animal);
        } else {
            res.status(404).send({ message: 'Animal Not Found' });
        }
    })
);

animalRouter.delete(
    '/:id',
    isAuth,
    isEmployee,
    expressAsyncHandler(async (req, res) => {
        const animal = await Animal.findById(req.params.id).populate('owner');
        if (animal) {
            await animal.deleteOne();;
            res.send({ message: 'Animal Deleted' });
        } else {
            res.status(404).send({ message: 'Animal Not Found' });
        }
    })
);

animalRouter.put(
    '/:id',
    isAuth,
    isEmployee,
    expressAsyncHandler(async (req, res) => {
        const animal = await Animal.findById(req.params.id);
        if (animal) {
            animal.name = req.body.name || animal.name;
            animal.dateOfBirth = animal.dateOfBirth;
            animal.gender = req.body.gender || animal.gender;
            animal.breed = req.body.breed || animal.breed;
            animal.subBreed = req.body.subBreed || animal.subBreed;
            animal.color = req.body.color || animal.color;
            animal.owner = animal.owner;
            const updatedAnimal = await animal.save();
            res.send({ message: 'Animal Updated', animal: updatedAnimal });
        } else {
            res.status(404).send({ message: 'Animal Not Found' });
        }
    })
);

export default animalRouter;