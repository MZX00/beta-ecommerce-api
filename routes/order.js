import express from "express";
import { createOrder } from "../controllers/order";

const router = express.Router();

router.post("/admin/view", viewAllOrders);

router.post("/create", createOrder);

export default router;
