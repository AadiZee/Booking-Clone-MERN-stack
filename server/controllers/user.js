const User = require("../models/User");

// const createUser = async (req, res, next) => {
//   const newUser = new User(req.body);
//   try {
//     const savedUser = await newUser.save();
//     if (savedUser) {
//       res
//         .status(200)
//         .json({ message: "User saved successfully!", data: savedUser });
//     }
//   } catch (error) {
//     console.log(error);
//     next(error);
//     // return res
//     //   .status(500)
//     //   .json({ message: "Error Creating User!", error: error });
//   }
// };

const getAllUsers = async (req, res, next) => {
  try {
    const savedUsers = await User.find({}).sort("desc");
    if (savedUsers) {
      res.status(200).json(savedUsers);
    } else {
      return res.status(404).json({ message: "Users not found!" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedUser) {
      res
        .status(200)
        .json({ message: "User updated successfully!", data: updatedUser });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const searchedUser = await User.findById(req.params.id);
    if (searchedUser) {
      return res
        .status(200)
        .json({ message: "User found!", data: searchedUser });
    } else {
      return res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  //   createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
};
