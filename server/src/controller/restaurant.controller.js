import mongoose from "mongoose";
import Restaurant from "../models/restaurant.models.js";
import { UploadImage } from "../utils/cloudinary.js";

export const createMyRestaurent = async (req, res) => {
  try {
    const existingRestauranr = await Restaurant.findOne(req.userId);
    if (existingRestauranr) {
      return res
        .status(409)
        .json({ message: "User restaurant already exists" });
    }

    const imageUrl = await UploadImage(req.file);

    req.body.user = req.userId;

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;

    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    // console.log(restaurant);
    res.json(restaurant);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;

    if (req.file) {
      const imageUrl = await UploadImage(req.file);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();
    res.status(200).send(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMyRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      return res.status(400).json({ message: "restaurant not found" });
    }

    const orders = await OrderedBulkOperation.find({
      restaurant: restaurant._id,
    })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
