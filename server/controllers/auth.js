const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { createError } = require("../utils/error");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    // const newUser = new User({
    //   username: req.body.username,
    //   email: req.body.email,
    //   password: hash,
    // });

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created!");
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    if (req.body.email) {
      const email = req.body.email;
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        return next(createError(404, "User not found for the email provided!"));
      }
      const correctPassword = await bcrypt.compare(
        req.body.password,
        existingUser.password
      );
      if (!correctPassword) {
        return next(createError(400, "Incorrect password provided!"));
      } else {
        const token = jwt.sign(
          { id: existingUser._id, isAdmin: existingUser.isAdmin },
          process.env.DB_SECRET
        );
        const { password, isAdmin, ...otherUserDetails } = existingUser._doc;
        return res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json({ details: { ...otherUserDetails }, isAdmin });
      }
    } else if (req.body.username) {
      const username = req.body.username;
      const existingUser = await User.findOne({ username: username });
      if (!existingUser) {
        return next(
          createError(404, "User not found for the username provided")
        );
      }
      const correctPassword = await bcrypt.compare(
        req.body.password,
        existingUser.password
      );

      if (!correctPassword) {
        return next(createError(400, "Incorrect password provided!"));
      } else {
        const token = jwt.sign(
          { id: existingUser._id, isAdmin: existingUser.isAdmin },
          process.env.DB_SECRET
        );
        const { password, isAdmin, ...otherUserDetails } = existingUser._doc;
        return res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json({ details: { ...otherUserDetails }, isAdmin });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
