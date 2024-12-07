import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
})

export interface User {
    id: string; // Unique identifier
    username: string;
    email: string;
    password: string; // hashed password
}
