import express from "express";
import * as accountController from "../controllers/account.controller.js";

const router = express.Router();

router.post("/sign-up", accountController.registerNewUser);

export default router;
