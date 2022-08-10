import express from "express";
import { createOrder, viewAllOrders } from "../controllers/order.js";

const router = express.Router();

router.post("/admin/view", viewAllOrders);

router.post("/create", createOrder);

export default router;
