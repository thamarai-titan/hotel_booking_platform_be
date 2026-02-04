import z from 'zod'

export const bookingSchema = z.object({
    roomId: z.string().min(1,"provide the roomId"),
    checkInDate: z.string(),
    checkOutDate: z.string(),
    guests: z.number().min(1,"Atleast a guest needed")
})

export type bookingSchemaType = z.infer<typeof bookingSchema>