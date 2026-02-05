import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import type { bookingSchemaType } from "../schemas/bookings.schema";
import type { StringLike } from "bun";

export const getHotelDetailsWithroomId = async (roomId: string) => {
  try {
    const hotelDetails = await prisma.rooms.findUnique({
      where: {
        id: roomId,
      },
    });

    return hotelDetails;
  } catch (error) {
    throw error;
  }
};

export const createBookings = async (
  data: bookingSchemaType,
  total_price: number,
  userId: string,
  hotel_id: string,
) => {
  const { roomId, checkInDate, checkOutDate, guests } = data;

  try {
    console.log({ roomId, hotel_id, userId });

    const booking = await prisma.bookings.create({
      data: {
        room_id: roomId,
        hotel_id,
        user_id: userId,
        total_price,
        check_in_date: new Date(checkInDate),
        check_out_date: new Date(checkOutDate),
        guests,
      },
    });

    console.log("booking created:", booking);
    return booking;
  } catch (error) {
    console.error("Create booking error:", error);
    throw error;
  }
};

export const getAllBookingsFromCurrentUser = async (
  user_id: string,
  status: string,
) => {
  try {
    const hasStatus = status === "confirmed" || status === "cancelled";

    const where: Prisma.BookingsWhereInput = {};

    if (user_id) {
      where.user_id = user_id;
    }

    if (hasStatus) {
      where.status = status;
    }
    const userBookings = await prisma.bookings.findMany({
      where,
      include: {
        hotels: {
          select: {
            id: true,
            name: true,
          },
        },
        rooms: {
          select: {
            id: true,
            room_number: true,
            room_type: true,
          },
        },
      },
      orderBy: {
        booking_date: "desc",
      },
    });

    return userBookings;
  } catch (error) {
    throw error;
  }
};

export const modifyBooking = async (bookingId: string, userId: string) => {
  try {
    const booking = await prisma.bookings.findFirst({
      where: {
        id: bookingId,
        user_id: userId,
      },
    });

    if (!booking) {
      throw new Error("BOOKING_NOT_FOUND");
    }

    if (booking.status === "cancelled") {
      throw new Error("ALREADY_CANCELLED");
    }

    const now = new Date();
    const checkInDate = new Date(booking.check_in_date);

    const diffInHours =
      (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      throw new Error("CANCELLATION_DEADLINE_PASSED");
    }

    const modifiedBooking = await prisma.bookings.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "cancelled",
        cancelled_date: new Date(),
      },
    });
    return modifiedBooking;
  } catch (error) {
    throw error;
  }
};
