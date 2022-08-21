import express from "express";
import {
  deleteAccount,
  signIn,
  signUp,
  updatePassword,
  getInfo,
  setName,
  addPaymentCard,
  editPaymentCard,
  deleteCard,
  viewUserAddress,
  viewUserPaymentCard,
  addAddress,
  updateAddres,
  deleteAddress,
} from "../controllers/user.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/update/password", updatePassword);

router.post("/update/name", setName);

router.post("/view", getInfo);

router.post("/delete", deleteAccount);

router.post("/card/create", addPaymentCard);

router.post("/card/update", editPaymentCard);

router.post("/card/delete", deleteCard);

router.post("/card/view", viewUserPaymentCard);

router.post("/address/view", viewUserAddress);

router.post("/address/update", updateAddres);

router.post("/address/delete", deleteAddress);

router.post("/address/create", addAddress);

export default router;
