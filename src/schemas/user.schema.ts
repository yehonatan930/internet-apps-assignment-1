import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
})

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}
