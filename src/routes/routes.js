import express from "express";
import * as accountController from "../controllers/account.controller.js";

const router = express.Router();

router.post(
  `${process.env.MONGO_URI}/sign-up`,
  accountController.registerNewUser
);
router.get(
  `${process.env.MONGO_URI}/sign-in`,
  accountController.getUsers
);

export default router;
