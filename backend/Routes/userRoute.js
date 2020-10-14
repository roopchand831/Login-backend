import express from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const newuser = await user.save();

    if (newuser) {
      res.send({
        _id: newuser._id,
        name: newuser.name,
        email: newuser.email,
        token: jwt.sign(
          {
            _id: newuser._id,
            name: newuser.name,
            email: newuser.email,
          },
          config.JWT_SECRET
        ),
      });
    } else {
      res.status(401).send("Invalid user Data");
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const signinUser = await User.findOne({ email: req.body.email });
    if (!signinUser) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      signinUser.password
    );
    if (validPassword) {
      res.send({
        _id: signinUser._id,
        email: signinUser.email,
        name: signinUser.name,
        token: jwt.sign(
          {
            _id: signinUser._id,
            name: signinUser.name,
            email: signinUser.email,
          },
          "jwtPrivateKey"
        ),
      });
    } else {
      res.status(400).send("invalid username or password");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default router;
