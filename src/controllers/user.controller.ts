import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { IUser, userSchema } from "../schemas/user.schema"; // For generating unique u
const router = express.Router();

const User = mongoose.model("User", userSchema);

router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const users: IUser[] = await User.find({ email });

  // Check if user exists
  if (users.length) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    _id: uuidv4(),
    username,
    email,
    password: hashedPassword,
  });

  newUser.save();
  res.status(201).json({ message: "User registered successfully" });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: IUser = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate tokens
  // const accessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  // const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET);
  //
  // refreshTokens.push(refreshToken);
  // res.status(200).json({ accessToken, refreshToken });
});

router.post("/logout", (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  // refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  res.status(200).json({ message: "User logged out" });
});

router.get("/users", async (req: Request, res: Response) => {
  const users: IUser[] = await User.find({});

  res.status(200).json(users);
});

router.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user: IUser = await User.findOne({ _id: id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

router.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  const users: IUser[] = await User.find({});

  const userIndex = users.findIndex((u) => u._id === id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = {
    ...users[userIndex],
    username: username || users[userIndex].username,
    email: email || users[userIndex].email,
    password: password
      ? bcrypt.hashSync(password, 10)
      : users[userIndex].password,
    updatedAt: new Date(),
  };

  users[userIndex] = updatedUser;
  res
    .status(200)
    .json({ message: "User updated successfully", user: updatedUser });
});

router.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User deleted successfully" });
});
