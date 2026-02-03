import type {Request, Response} from "express"
import { HotelSchema, type HotelSchemaType } from "../schemas/hotels.schema"
import { createHotel, getAllHotels } from "../services/hotels.service"
import { getHotelswithPriceFilter } from "../services/rooms.service"
import type { Prisma } from "@prisma/client"

interface QueryParams {
    city?: string,
    country?: string,
    minPrice?: string,
    maxPrice?: string,
    minRating?: string
}

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


export const getAllHotelsController = async (req: Request<QueryParams>, res: Response)=>{
    console.log("1")
    try {
        let {
        city,
        country,
        minPrice,
        maxPrice,
        minRating
    } = req.query

    const min_price = Number(minPrice)
    const max_price = Number(maxPrice)
    city = String(city)
    country = String(country)

    console.log("2")
    const roomGroups = await getHotelswithPriceFilter(min_price, max_price)

    console.log("3")
    const hotelIds = roomGroups.map(data => data.hotel_id)

    const minPriceMap = new Map(
        roomGroups.map(data => [
            data.hotel_id,
            data._min.price_per_night
        ])
    )
    console.log("4")
    const where: Prisma.HotelsWhereInput = {};


    if(hotelIds?.length){
        where.id = {
            in: hotelIds
        }
    }

    if(city){
        where.city = city
    }

    if(country){
        where.country = country
    }

    if(minRating){
        where.rating = {
            gte: Number(minRating)
        }
    }
    console.log("5")
    const hotels = await getAllHotels(where)
    const data = hotels.map(data => ({
        id: data.id,
        name: data.name,
        description: data.description,
        city: data.city,
        country: data.country,
        ameities: data.amenities,
        rating: data.rating,
        totalReviews: data.total_reviews,
        minPricePerHotel: minPriceMap.get(data.id)
    }))
    console.log("6")
    res.status(200).json({
        success: true,
        data: data,
        error: null
    })

    } catch (error) {
        res.status(401).json({
            success: false,
            data: null,
            error: "UNAUTHORIZED"
        })
    }


}

