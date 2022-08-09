const express = require("express");
const {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
  getRoomById,
  updateRoomAvailability,
} = require("../controllers/room");
const { verifyAdmin, verifyToken } = require("../utils/verifyToken");

const router = express.Router();

router.route("/:hotelId").post(verifyAdmin, createRoom);

router.route("/").get(getAllRooms);

router.route("/:id").put(verifyAdmin, updateRoom).get(getRoomById);
router.route("/availability/:id").put(verifyToken, updateRoomAvailability);

router.route("/:id/:hotelId").delete(verifyAdmin, deleteRoom);

module.exports = router;
