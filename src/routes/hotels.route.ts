import { Router } from "express";
import { requireRole, verifyUser } from "../middleware/middleware";
import { createHotelController } from "../controllers/hotels.controller";

const router = Router()

router.post("/hotels", verifyUser, requireRole, createHotelController)

export default router