import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true},
        price: { type: Number, required: true},
        procedure: { type: String, required: true},
        description: { type: String},
        employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;