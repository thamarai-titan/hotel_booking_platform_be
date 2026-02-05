import type {Request, Response} from "express"
import { reviewSchema, type reviewSchemaType } from "../schemas/reviews.schema"
import { writeReview } from "../services/reviews.service"
import { success } from "zod"


export const reviewController = async (req:Request, res: Response)=>{
    try {
        const data: reviewSchemaType = reviewSchema.parse(req.body)

        const review = await writeReview(data)

        if(!review){
            return res.status(400).json({
                success: false,
                data: null,
                error: "CANNOT_WRITE_REVIEW"
            })
        }

        res.status(200).json({
            success: true,
            data: {
                id: review.id,
                userId: review.user_id,
                hotelId: review.hotel_id,
                bookingId: review.booking_id,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt
            }
        })
    } catch (error: any) {
        if(error.message === "BOOKING_NOT_FOUND"){
            res.status(404).json({
                success: false,
                data: null,
                error: "BOOKING_NOT_FOUND"
            })
        }

        if(error.message === "REVIEW_ALREADY_EXISTS"){
            res.status(404).json({
                success: false,
                data: null,
                error: "REVIEW_ALREADY_EXISTS"
            })
        }

        if(error.message === "BOOKING_NOT_ELIGIBLE"){
            res.status(404).json({
                success: false,
                data: null,
                error: "BOOKING_NOT_ELIGIBLE"
            })
        }

        res.status(400).json({
            success: false,
            data: null,
            error: "ERROR"
        })
    }
}