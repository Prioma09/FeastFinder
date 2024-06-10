// /api/my/user

import express from "express";
import {
  createCurrentUser,
  getCurrentUser,
  updateCurrentUser,
} from "../controller/user.controller.js";
import { jwtCheck, jwtParse } from "../middleware/auth.middleware.js";
import { validateMyUserRequest } from "../middleware/validator.middleware.js";

const router = express.Router();

router.post("/", jwtCheck, createCurrentUser);
router.put("/", jwtCheck, jwtParse, validateMyUserRequest, updateCurrentUser);
router.get("/", jwtCheck, jwtParse, getCurrentUser);

export { router };
