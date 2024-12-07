import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mongoose from "mongoose";
import {User, userSchema} from "../schemas/user.schema"; // For generating unique u
const router = express.Router();

const User = mongoose.model("User", userSchema);

router.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const users: User[] = await User.find({});

    // Check if user exists
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: uuidv4(),
        username,
        email,
        password: hashedPassword
    };

    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const users: User[] = await User.find({});

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    // const accessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    // const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET);
    //
    // refreshTokens.push(refreshToken);
    // res.status(200).json({ accessToken, refreshToken });
});

router.post('/logout', (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    // refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.status(200).json({ message: 'User logged out' });
});

