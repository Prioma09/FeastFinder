import express from "express";
import { param } from "express-validator";
import {
  getMyRestaurant,
  searchRestaurant,
} from "../controller/allRestaurant.controller.js";

const router = express.Router();

// /api/restaurant/search/:city
router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must have a value"),
  searchRestaurant
);
router.get(
  "/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("RestaurantId Parameter mustbe a valid string"),
  getMyRestaurant
);

export { router };
