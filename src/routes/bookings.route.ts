import { Router } from "express";
import { requireCustomer, verifyUser } from "../middleware/middleware";
import { createBookingsController, getAllBookingsController, modifiedBookingController } from "../controllers/bookings.controller";

const router = Router()


router.post("/bookings", verifyUser, requireCustomer, createBookingsController)
router.get("/bookings", verifyUser, requireCustomer, getAllBookingsController)
router.post("/bookings/:bookingId/cancel", verifyUser, requireCustomer, modifiedBookingController)
export default router