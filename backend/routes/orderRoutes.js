import express from "express";
import {isAuth, isEmployee} from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

const orderRouter = express.Router();

const PAGE_SIZE = 9;

orderRouter.get(
    '/',
    isAuth,
    isEmployee,
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || PAGE_SIZE;
        const orders = await Order.find({}).populate({
            path: 'animal',
            populate: { path: 'owner' } // Populate the owner field within the animal document
        }).populate('employee').skip(pageSize * (page - 1))
            .limit(pageSize);
        const countOrders = await Order.countDocuments();
        res.send({
            orders,
            countOrders,
            page,
            pages: Math.ceil(countOrders / pageSize),
        });
    })
);

orderRouter.post(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const newOrder = new Order({
            animal: req.body.animal,
            price: req.body.price,
            procedure: req.body.procedure,
            description: req.body.description,
            employee: req.user._id,
        });

        const orders = await newOrder.save();
        res.status(201).send({ message: 'New Order Created', orders });
    })
);

orderRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id).populate({
            path: 'animal',
            populate: { path: 'owner' } // Populate the owner field within the animal document
        }).populate('employee');
        if (order) {
            res.send(order);
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
);

orderRouter.get(
    '/animalorder/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const animalID = req.params.id;
        const orders = await Order.find({ animal: animalID }).populate({
            path: 'animal',
            populate: { path: 'owner' } // Populate the owner field within the animal document
        }).populate('employee');
        res.send(orders);
    })
);

orderRouter.delete(
    '/:id',
    isAuth,
    isEmployee,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.send({ message: 'Order Deleted' });
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
);

export default orderRouter;