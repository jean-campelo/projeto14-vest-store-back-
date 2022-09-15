import express from "express";
import * as accountController from "../controllers/account.controller.js";

const router = express.Router();

router.post(
  `${process.env.REACT_APP_API_BASE_URL}/sign-up`,
  accountController.registerNewUser
);
router.get(
  `${process.env.REACT_APP_API_BASE_URL}/sign-in`,
  accountController.getUsers
);

export default router;
