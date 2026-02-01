import { da } from "zod/locales"
import { prisma } from "../db/prisma.ts"
import type { signupSchemaType } from "../schemas/auth.schema.ts"
import bcrypt from 'bcrypt'

export const createUser = async (data:signupSchemaType)=>{
    const {
        name,
        email,
        password,
        role,
        phone
    } = data

    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            phone: String(phone)
        }
    })
    return user
    } catch (error) {
        throw new Error("User could not be created")
    }

    
}