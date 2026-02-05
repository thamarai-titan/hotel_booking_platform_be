import { Router } from "express";
import { requireCustomer, verifyUser } from "../middleware/middleware";
import { reviewController } from "../controllers/reviews.controller";

const router = Router()


router.post("/reviews", verifyUser, requireCustomer, reviewController)

export default router