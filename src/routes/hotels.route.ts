import { Router } from "express";
import { requireRole, verifyUser } from "../middleware/middleware";
import { createHotelController } from "../controllers/hotels.controller";
import { addRoomtoHotels } from "../controllers/rooms.controller";

const router = Router()

router.post("/hotels", verifyUser, requireRole, createHotelController)
router.post("/hotels/:hotelId/rooms", verifyUser, requireRole, addRoomtoHotels)

export default router