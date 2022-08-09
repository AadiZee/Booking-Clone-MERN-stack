const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    if (savedHotel) {
      res
        .status(200)
        .json({ message: "Hotel saved successfully!", data: savedHotel });
    }
  } catch (error) {
    console.log(error);
    next(error);
    // return res
    //   .status(500)
    //   .json({ message: "Error Creating Hotel!", error: error });
  }
};

const getAllHotels = async (req, res, next) => {
  if (req.query) {
    const { min, max, limit, ...others } = req.query;
    try {
      const savedHotels = await Hotel.find({
        ...others,
        cheapestPrice: { $gte: min | 1, $lte: max || 999999 },
      })
        .limit(limit)
        .sort("desc");
      if (savedHotels) {
        res.status(200).json({
          message: "All Hotel data found successfully!",
          data: savedHotels,
        });
      } else {
        return res.status(404).json({ message: "Hotels not found!" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  } else {
    try {
      const savedHotels = await Hotel.find({}).sort("desc");
      if (savedHotels) {
        res.status(200).json({
          message: "All Hotel data found successfully!",
          data: savedHotels,
        });
      } else {
        return res.status(404).json({ message: "Hotels not found!" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};

const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedHotel) {
      res
        .status(200)
        .json({ message: "Hotel updated successfully!", data: updatedHotel });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Hotel deleted successfully!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getHotelById = async (req, res, next) => {
  try {
    const searchedHotel = await Hotel.findById(req.params.id);
    if (searchedHotel) {
      return res
        .status(200)
        .json({ message: "Hotel found!", data: searchedHotel });
    } else {
      return res.status(404).json({ message: "Hotel not found!" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json({
      message: "All Hotel for cities found successfully!",
      data: list,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartment", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
      { type: "cabin", count: cabinCount },
    ]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );

    res.status(200).json({ message: "Rooms found!", data: list });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHotel,
  getAllHotels,
  updateHotel,
  deleteHotel,
  getHotelById,
  countByCity,
  countByType,
  getHotelRooms,
};
