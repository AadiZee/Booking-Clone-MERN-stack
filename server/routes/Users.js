const express = require("express");
const { register } = require("../controllers/auth");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controllers/user");
const {
  verifyToken,
  verifyUser,
  verifyAdmin,
} = require("../utils/verifyToken");

const router = express.Router();

//token checking
// router.get("/checkauthentication", verifyToken, (req, res, next) => {
//   res.send("Hello, you are logged in!");
// });

// router.get("/checkuser/:id", verifyUser, (req, res, next) => {
//   res.send("Hello, you are logged in and you can delete your account!");
// });

// router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
//   res.send("Hello admin, you are logged in and you can delete all accounts!");
// });

router.post("/", register);
router.route("/").get(verifyAdmin, getAllUsers);

router
  .route("/:id")
  .put(verifyUser, updateUser)
  .delete(verifyUser, deleteUser)
  .get(verifyUser, getUserById);

module.exports = router;
