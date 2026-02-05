import { prisma } from "../db/prisma.ts";
import type { reviewSchemaType } from "../schemas/reviews.schema";

export const writeReview = async (data: reviewSchemaType) => {
  const { bookingId, rating, comment } = data;

  try {
    const bookingDetails = await prisma.bookings.findFirst({
      where: {
        id: bookingId,
      },
      include: {
        reviews: true,
      },
    });
    console.log(bookingDetails?.reviews.values);

    if (!bookingDetails) {
      throw new Error("BOOKING_NOT_FOUND");
    }
    if (bookingDetails.reviews.length > 0) {
      throw new Error("REVIEW_ALREADY_EXISTS");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkOutDate = bookingDetails.check_out_date;

    const canReview =
      checkOutDate < today && bookingDetails.status === "confirmed";

    if (!canReview) {
      throw new Error("BOOKING_NOT_ELIGIBLE");
    }

    const review = await prisma.reviews.create({
      data: {
        booking_id: bookingId,
        hotel_id: bookingDetails.hotel_id,
        user_id: bookingDetails.user_id,
        rating: rating,
        comment: comment,
        
      },
    });

    return review
  } catch (error) {
    throw error
  }
};
