import { prisma } from "../db/prisma";
import type { bookingSchemaType } from "../schemas/bookings.schema";

export const getHotelDetailsWithroomId = async (roomId: string) => {
    try {
        const hotelDetails = await prisma.rooms.findUnique({
            where: {
                id: roomId
            }
        })

        return hotelDetails

    } catch (error) {
        throw error
    }
}

export const createBookings = async (data: bookingSchemaType, total_price: number, userId:  string, hotel_id: string) => {
    const {
        roomId,
        checkInDate,
        checkOutDate,
        guests
    } = data 

    try {
        const booking = await prisma.bookings.create({
            data: {
                room_id: roomId,
                hotel_id: hotel_id,
                user_id: userId,
                total_price: total_price,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                guests: guests
            }
        })

        return booking
    } catch (error) {
        
    }
}