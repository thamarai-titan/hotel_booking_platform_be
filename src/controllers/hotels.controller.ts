import type {Request, Response} from "express"
import { HotelSchema, type HotelSchemaType } from "../schemas/hotels.schema"
import { createHotel } from "../services/hotels.service"


export const createHotelController = async (req:Request, res:Response)=>{
    try {
        const data:HotelSchemaType = HotelSchema.parse(req.body)
        const userId = req.userId
        const hotel = await createHotel(data,userId)
        res.status(201).json({
            success:true,
            data: {
                id: hotel.id,
                owner_id: hotel.owner_id,
                name: hotel.name,
                description: hotel.description,
                city: hotel.city,
                country: hotel.country,
                amenities: hotel.amenities,
                rating: hotel.rating,
                totalReviews: hotel.total_reviews
            },
            error: null
        })
    } catch (error: any) {
        if(error?.name === "ZodError"){
            res.status(401).json({
                success: false,
                data: null,
                error: "All fields must satisfy the criteria"
            })
        }

        res.status(400).json({
            success: false,
            data: null,
            error: "INVALID_REQUEST"
        })
    }

}   