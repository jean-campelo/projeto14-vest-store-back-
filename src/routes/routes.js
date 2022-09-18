import express from "express";
import * as accountController from "../controllers/account.controller.js";
import * as homeController from "../controllers/home.controllers.js";

import { authenticateToken } from "../middleware/authorization.middleware.js"

const router = express.Router();

// Login
router.post("/sign-up", accountController.registerNewUser);
router.post("/sign-in", accountController.accessAccount);

// add produto (provisória)
router.post("/add-product", homeController.addProduct);

// Home
router.get("/home", authenticateToken, homeController.returnProducts);
router.get("/home/:category", authenticateToken, homeController.returnCategory);



export default router;
