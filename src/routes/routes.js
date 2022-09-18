import express from "express";
import * as accountController from "../controllers/account.controller.js";
import * as homeController from "../controllers/home.controllers.js";

const router = express.Router();

router.post("/sign-up", accountController.registerNewUser);
router.post("/sign-in", accountController.accessAccount);

router.post("/add-product", homeController.addProduct);
router.get("/home", homeController.returnProducts);
router.get("/home/:category", homeController.returnCategory);

export default router;
