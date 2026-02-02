import { prisma } from "../db/prisma";
import type { roomsSchemaType } from "../schemas/rooms.schema";

export const createRoomForHotels = async (
  data: roomsSchemaType,
  hotelId: string,
) => {
  const { roomNumber, roomType, maxOccupancy, pricePerNight } = data;

  const hotel_id = hotelId;

  try {
    const room_num = await prisma.rooms.findUnique({
      where: {
        room_number: roomNumber,
      },
    });
    if (room_num) {
      throw new Error("ROOM_ALREADY_EXISTS");
    }
    const room = await prisma.rooms.create({
      data: {
        hotel_id,
        room_number: roomNumber,
        room_type: roomType,
        price_per_night: pricePerNight,
        max_occupancy: maxOccupancy,
      },
    });
    return room;
  } catch (error) {
    throw error;
  }
};
