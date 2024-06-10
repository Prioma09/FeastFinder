import express from "express";
import {
  createMyRestaurent,
  getMyRestaurant,
  getMyRestaurantOrders,
  updateMyRestaurant,
} from "../controller/restaurant.controller.js";
import { jwtCheck, jwtParse } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { validateMyRestaurantRequest } from "../middleware/validator.middleware.js";

const router = express.Router();

//  /api/my/restaurant

router.post(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  createMyRestaurent
);
router.get("/", jwtCheck, jwtParse, getMyRestaurant);
router.put(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  updateMyRestaurant
);

router.get("/order", jwtCheck, jwtParse, getMyRestaurantOrders);

export { router };
