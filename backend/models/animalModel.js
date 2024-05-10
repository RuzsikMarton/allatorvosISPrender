import mongoose from "mongoose";


const animalSchema = new mongoose.Schema({
        name: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, required: true },
        breed: { type: String, required: true },
        subBreed: { type: String },
        color: { type: String, required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},
    {
            timestamps: true,
    }
    );


const Animal = mongoose.model('Animal', animalSchema);
export default Animal;