const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const { createError } = require("../utils/error");

const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (error) {
      next(error);
    }

    res.status(200).json(savedRoom);
  } catch (error) {
    next(error);
  }
};

const getAllRooms = async (req, res, next) => {
  try {
    const savedRooms = await Room.find({}).sort("desc");
    if (savedRooms) {
      res.status(200).json({
        message: "All Room data found successfully!",
        data: savedRooms,
      });
    } else {
      return res.status(404).json({ message: "Rooms not found!" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedRoom) {
      res
        .status(200)
        .json({ message: "Room updated successfully!", data: updatedHotel });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: { "roomNumbers.$.unavailableDates": req.body.dates },
      }
    );

    res.status(200).json({ message: "Room availability updated" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;

  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (error) {
      next(error);
    }

    res.status(200).json({ message: "Room deleted successfully!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getRoomById = async (req, res, next) => {
  try {
    const searchedRoom = await Room.findById(req.params.id);
    if (searchedRoom) {
      return res
        .status(200)
        .json({ message: "Room found!", data: searchedRoom });
    } else {
      return res.status(404).json({ message: "Room not found!" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomById,
  getAllRooms,
  updateRoomAvailability,
};
