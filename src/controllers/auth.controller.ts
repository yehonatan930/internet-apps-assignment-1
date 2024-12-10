import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { IUser, userSchema } from "../schemas/user.schema"; // For generating unique u
import jwt from "jsonwebtoken";
const router = express.Router();

const User = mongoose.model("User", userSchema);

router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const user: IUser = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      _id: uuidv4(),
      username,
      email,
      password: encryptedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch {
    res.status(500).json({ message: "Error registering user" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const user: IUser = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    res.status(200).json({ accessToken });
  } catch {
    res.status(500).json({ message: "Error logging in user" });
  }
});

router.post("/logout", (req: Request, res: Response) => {});

export default router;
