import express from "express";
import {
  createOrder,
  viewAllOrders,
  viewUserOrder,
  updateStatus,
} from "../controllers/order.js";

const router = express.Router();

router.post("/admin/view", viewAllOrders);

router.post("/view", viewUserOrder);

router.post("/create", createOrder);

router.post("/admin/status/update", updateStatus);

export default router;
