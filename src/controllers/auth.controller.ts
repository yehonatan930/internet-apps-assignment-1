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
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken: string = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken: string = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.REFRESH_SECRET
    );

    if (!user.tokens) {
      user.tokens = [refreshToken];
    } else {
      user.tokens.push(refreshToken);
    }

    await user.save();

    res.status(200).json({ accessToken, refreshToken });
  } catch {
    res.status(500).json({ message: "Error logging in user" });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    jwt.verify(
      token,
      process.env.REFRESH_SECRET,
      async (err: jwt.VerifyErrors, userInfo: jwt.JwtPayload) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const userId = userInfo._id;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (!user.tokens.includes(token)) {
          user.tokens = [];
          await user.save();
          return res.status(403).json({ message: "Forbidden" });
        }

        const accessToken: string = jwt.sign(
          { email: user.email, _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
          { email: user.email, _id: user._id },
          process.env.REFRESH_SECRET
        );

        user.tokens[user.tokens.indexOf(token)] = refreshToken;
        await user.save();
        res.status(200).json({ accessToken, refreshToken });
      }
    );
  } catch {
    res.status(500).json({ message: "Error refreshing token" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    jwt.verify(
      token,
      process.env.REFRESH_SECRET,
      async (err: jwt.VerifyErrors, userInfo: jwt.JwtPayload) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const userId = userInfo._id;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (!user.tokens.includes(token)) {
          user.tokens = [];
          await user.save();
          return res.status(403).json({ message: "Forbidden" });
        }

        user.tokens = user.tokens.splice(user.tokens.indexOf(token), 1);
        await user.save();
        res.status(200).json({ message: "User logged out successfully" });
      }
    );
  } catch {
    res.status(500).json({ message: "Error logging out user" });
  }
});

export default router;
