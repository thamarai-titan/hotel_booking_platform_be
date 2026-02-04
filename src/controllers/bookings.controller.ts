import type { Request, Response } from "express";
import {
  bookingSchema,
  type bookingSchemaType,
} from "../schemas/bookings.schema";
import {
  createBookings,
  getAllBookingsFromCurrentUser,
  getHotelDetailsWithroomId,
} from "../services/bookings.service";
import type { Prisma } from "@prisma/client";
import { da } from "zod/locales";


type Params = {
  status: string;
}

export const createBookingsController = async (req: Request, res: Response) => {
  try {
    const data: bookingSchemaType = bookingSchema.parse(req.body);
    const roomId = data.roomId;

    const hotelRoomData = await getHotelDetailsWithroomId(roomId);

    if (!hotelRoomData) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "ROOM_NOT_FOUND",
      });
    }

    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);

    const nights =
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

    const totalPrice = nights * Number(hotelRoomData.price_per_night);

    const booking = await createBookings(
      data,
      totalPrice,
      req.userId,
      hotelRoomData.hotel_id,
    );

    if (!booking) {
      return res.status(400).json({
        success: false,
        data: null,
        error: "BOOKING_NOT_CREATED",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: booking.id,
        userId: booking.user_id,
        roomId: booking.room_id,
        hotelId: booking.hotel_id,
        checkInDate: booking.check_in_date,
        checkOutDate: booking.check_out_date,
        guests: booking.guests,
        totalPrice: booking.total_price,
        status: booking.status,
        bookingDate: booking.booking_date,
      },
      error: null
    });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return res.status(400).json({
        success: false,
        data: null,
        error: "INVALID_REQUEST",
      });
    }

    res.status(400).json({
      success: false,
      data: null,
      error: "INVALID_REQUEST",
    });
  }
};

export const getAllBookingsController = async (req: Request<Params>, res: Response) => {
  try {
    const userId = req.userId;
    let { status } = req.query
    
    const UserBookings = await getAllBookingsFromCurrentUser(userId,String(status))

    const data = UserBookings.map(d => ({
      id: d.id,
      roomId: d.room_id,
      hotelId: d.hotel_id,
      hotelName: d.hotels.name,
      roomNumber: d.rooms.room_number,
      roomType: d.rooms.room_type,
      checkInDate: d.check_in_date,
      checkOutDate: d.check_out_date,
      guests: d.guests,
      totalPrice: Number(d.total_price),
      status: d.status,
      bookingDate: d.booking_date
    }))

    res.status(200).json({
      success: true,
      data: data,
      error: null
    })
  } catch (error) {

    res.status(400).json({
      success: true,
      data: null,
      error: "ERROR"
    })

  }
};
