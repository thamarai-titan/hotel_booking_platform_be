import z from "zod"

export const HotelSchema = z.object({
    name: z.string().min(1,"Hotel name is required"),
    description: z.string().min(4, "Desciprtion Needed"),
    city: z.string().min(2,"City is Required"),
    country: z.string().min(2, "Country is Required"),
    amenities: z.array(z.string())
})

export type HotelSchemaType = z.infer<typeof HotelSchema> 