import { Router } from "express";
import { requireOwner, verifyUser } from "../middleware/middleware";
import { createHotelController, getAllHotelsController, getAllHotelsWithHotelIdController } from "../controllers/hotels.controller";
import { addRoomtoHotels } from "../controllers/rooms.controller";

const router = Router()

router.post("/hotels", verifyUser, requireOwner, createHotelController)
router.post("/hotels/:hotelId/rooms", verifyUser, requireOwner, addRoomtoHotels)
router.get("/hotels",verifyUser, requireOwner, getAllHotelsController)
router.get("/hotels/:hotelId", verifyUser, getAllHotelsWithHotelIdController)


export default router