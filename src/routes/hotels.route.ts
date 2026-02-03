import { Router } from "express";
import { requireRole, verifyUser } from "../middleware/middleware";
import { createHotelController, getAllHotelsController } from "../controllers/hotels.controller";
import { addRoomtoHotels } from "../controllers/rooms.controller";

const router = Router()

router.post("/hotels", verifyUser, requireRole, createHotelController)
router.post("/hotels/:hotelId/rooms", verifyUser, requireRole, addRoomtoHotels)
router.get("/hotels",verifyUser, requireRole, getAllHotelsController)

export default router