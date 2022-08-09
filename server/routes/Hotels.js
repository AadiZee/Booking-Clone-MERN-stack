const express = require("express");
const {
  createHotel,
  updateHotel,
  deleteHotel,
  getAllHotels,
  getHotelById,
  countByCity,
  countByType,
  getHotelRooms,
} = require("../controllers/hotel");
const { verifyAdmin, verifyToken } = require("../utils/verifyToken");

const router = express.Router();

router.route("/").post(verifyAdmin, createHotel).get(getAllHotels);

router
  .route("/find/:id")
  .put(verifyAdmin, updateHotel)
  .delete(verifyAdmin, deleteHotel)
  .get(getHotelById);

router.route("/countByCity").get(countByCity);
router.route("/countByType").get(countByType);
router.route("/room/:id").get(verifyToken, getHotelRooms);

module.exports = router;
