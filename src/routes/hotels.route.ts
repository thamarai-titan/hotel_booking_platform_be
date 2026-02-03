import { Router } from "express";
import { requireRole, verifyUser } from "../middleware/middleware";
import { createHotelController, getAllHotelsController, getAllHotelsWithHotelIdController } from "../controllers/hotels.controller";
import { addRoomtoHotels } from "../controllers/rooms.controller";

const router = Router()

router.post("/hotels", verifyUser, requireRole, createHotelController)
router.post("/hotels/:hotelId/rooms", verifyUser, requireRole, addRoomtoHotels)
router.get("/hotels",verifyUser, requireRole, getAllHotelsController)
router.get("/hotels/:hotelId", verifyUser, getAllHotelsWithHotelIdController)


export default router