import express from "express";
import * as accountController from "../controllers/account.controller.js";
import * as cartController from "../controllers/cart.controller.js";
import {validateCartInfo} from "../middlewares/validateCartInfo.js";

const router = express.Router();

router.post("/sign-up", accountController.registerNewUser);

router.get("/cart/my-cart", cartController.getCartItems);

router.delete("/cart/my-cart", cartController.removeProductFromCart);

router.put("/cart/my-cart", cartController.updateProductQuantity);

router.post("/cart/my-cart", validateCartInfo, cartController.addProductToCart);

export default router;
