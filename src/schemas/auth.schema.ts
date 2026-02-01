import z from "zod"

export const signupSchema = z.object({
    name: z.string().min(1,"Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    role: z.enum(["customer", "owner"], {
        error: "Role must be customer or owner"
    }),
    phone: z.string()
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Provide the correct password")
})

export type signupSchemaType = z.infer<typeof signupSchema>
export type loginSchemaType = z.infer<typeof loginSchema>
