import type { Request, Response } from "express";
import {
  bookingSchema,
  type bookingSchemaType,
} from "../schemas/bookings.schema";
import {
  createBookings,
  getHotelDetailsWithroomId,
} from "../services/bookings.service";


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
      hotelRoomData.id,
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
        error: "INVALID_REQUEST"
    })
  }
};
