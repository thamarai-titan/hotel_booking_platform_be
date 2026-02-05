import z from "zod"

export const reviewSchema = z.object({
    bookingId: z.string(),
    rating: z.number().min(1, "At least a star needed"),
    comment: z.string().min(4,"write a comment")
})

export type reviewSchemaType = z.infer<typeof reviewSchema>