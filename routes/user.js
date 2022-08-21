import express from "express";
import {
  deleteAccount,
  signIn,
  signUp,
  updatePassword,
  getInfo,
  setName,
} from "../controllers/user.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/update/password", updatePassword);

router.post("/update/name", setName);

router.post("/view", getInfo);

router.post("/delete", deleteAccount);

export default router;
