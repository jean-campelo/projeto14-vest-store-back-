import express from "express";
import * as accountController from "../controllers/account.controller.js";

const router = express.Router();

router.post("/sign-up", accountController.registerNewUser);
router.post("/sign-in", accountController.accessAccount);

export default router;
