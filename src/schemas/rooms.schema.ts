import z from "zod"

export const roomsSchema = z.object({
    roomNumber: z.string().min(1, "Atleast a digit expected"),
    roomType: z.string().min(1, "Define the correct room type"),
    pricePerNight: z.number(),
    maxOccupancy: z.number()
})

export type roomsSchemaType = z.infer<typeof roomsSchema>