import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

import { router as myUserRoutes } from "./Routes/user.routes.js";
import { router as myRestaurantRoutes } from "./Routes/restaurent.routes.js";
import { router as allRestaurantRoutes } from "./Routes/allRestaurant.routes.js";
import { router as orderRoutes } from "./Routes/order.routes.js";

const app = express();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("connected to database"));

app.use(cors());

app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));
app.use(express.json());

app.get("/health", async (req, res) => {
  res.send({ message: "health ok!" });
});

app.use("/api/my/user", myUserRoutes);
app.use("/api/my/restaurant", myRestaurantRoutes);
app.use("/api/restaurant", allRestaurantRoutes);
app.use("/api/order", orderRoutes);

app.listen(3000, () => {
  console.log("Server started on localhost :3000");
});
