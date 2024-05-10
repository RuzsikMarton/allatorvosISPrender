import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {generateToken, isAdmin, isAuth} from "../utils.js";

const userRouter = express.Router();

userRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const users = await User.find({isAdmin: false, isEmployee: false});
        res.send(users);
    })
);

userRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.city = req.body.city || user.city;
            if (req.body.password) {
                user.password = bcrypt.hashSync(req.body.password, 8);
            }

            const updatedUser = await user.save();
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                city: updatedUser.city,
                isAdmin: updatedUser.isAdmin,
                isEmployee: updatedUser.isEmployee,
                token: generateToken(user),
            });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    })
);


userRouter.get(
    '/employee',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const users = await User.find({ $or: [{ isAdmin: true }, { isEmployee: true }] });
        res.send(users);
    })
);

userRouter.get(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);

userRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.city = req.body.city || user.city;
            user.isEmployee = Boolean(req.body.isEmployee);
            user.isAdmin = Boolean(req.body.isAdmin);
            user.salary = req.body.salary || user.salary;
            user.department = req.body.department || user.department;
            const updatedUser = await user.save();
            res.send({ message: 'User Updated', user: updatedUser });
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);

userRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.isAdmin) {
                res.status(400).send({ message: 'Can Not Delete Admin User' });
                return;
            }
            await user.deleteOne();;
            res.send({ message: 'User Deleted' });
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);



userRouter.post(
    '/signin',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    city: user.city,
                    isAdmin: user.isAdmin,
                    isEmployee: user.isEmployee,
                    salary: user.salary,
                    department: user.department,
                    token: generateToken(user),
                });
                return;
            }
        }
        res.status(401).send({ message: 'Invalid email or password' });
    })
);

userRouter.post(
    '/signup',
    expressAsyncHandler(async (req, res) => {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
            phone: req.body.phone,
            address:req.body.address,
            city: req.body.city,
        });
        const user = await newUser.save();
        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            isAdmin: user.isAdmin,
            isEmployee: user.isEmployee,
            token: generateToken(user),
        });
    })
);

export default userRouter;