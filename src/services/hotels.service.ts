import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import type { HotelSchemaType } from "../schemas/hotels.schema";

export const createHotel = async (body: HotelSchemaType, userId: string)=>{
    const {
        name,
        description,
        city,
        country,
        amenities
    } = body

    try {
        const hotel = await prisma.hotels.create({
        data: {
            owner_id: userId,
            name,
            description,
            city,
            country,
            amenities
        }
    })

    return hotel
    } catch (error) {
        throw error
    }

}


export const getAllHotels = async (where: Prisma.HotelsWhereInput)=>{
    try {
        const hotels = await prisma.hotels.findMany({
            where
        })
        return hotels
    } catch (error) {
        throw error
    }
}