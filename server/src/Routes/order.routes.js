import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth.middleware.js";
import {
  createCheckoutSession,
  getMyOrders,
  stripeWebhookHandler,
} from "../controller/orders.controller.js";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, getMyOrders);

router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  createCheckoutSession
);

// localhost:3000/api/order

router.post("/checkout/webhook", stripeWebhookHandler);

export { router };
