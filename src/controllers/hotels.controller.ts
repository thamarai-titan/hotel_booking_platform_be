import type {Request, Response} from "express"
import { HotelSchema, type HotelSchemaType } from "../schemas/hotels.schema"
import { createHotel, getAllHotels, getSingleHotelInformation } from "../services/hotels.service"
import { getHotelswithPriceFilter, getRoomsWithHotelId } from "../services/rooms.service"
import type { Prisma } from "@prisma/client"


interface QueryParams {
    city?: string,
    country?: string,
    minPrice?: string,
    maxPrice?: string,
    minRating?: string
}

type Params = {
    hotelId: string
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

    if(typeof city === 'string' && city.trim() != ''){
        where.city = city
    }

    if(typeof country === 'string' && country.trim() != ''){
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

export const getAllHotelsWithHotelIdController = async (req: Request<Params>, res: Response)=>{
    const { hotelId } = req.params
    
    if(!hotelId) {
        return res.status(400).json({
            success: false,
            data: null,
            error: "ID NOT FOUND"
        })
    }

    const hotelDetails = await getSingleHotelInformation(hotelId)

    if(!hotelDetails){
        return res.status(404).json({
            success: false,
            data: null,
            error: "HOTEL_NOT_FOUND"
        })
    }

    const roomDetails = await getRoomsWithHotelId(hotelId)

    if(!roomDetails){
        return res.status(404).json({
            success: false,
            data: null,
            error: "ROOMS_NOT_FOUND"
        })
    }

    const data = {
        id: hotelDetails.id,
        owner_id: hotelDetails.owner_id,
        name: hotelDetails.name,
        description: hotelDetails.description,
        city: hotelDetails.city,
        country: hotelDetails.country,
        ameniteis: hotelDetails.amenities,
        rating: hotelDetails.rating,
        totalReviews: hotelDetails.total_reviews,
        rooms: roomDetails.map(data => ({
            id: data.id,
            roomNumber: data.room_number,
            roomType: data.room_type,
            pricePerNight: data.price_per_night,
            maxOccupancy: data.max_occupancy
        }))
    }

    res.status(200).json({
        success: true,
        data: data,
        error: null
    })

}