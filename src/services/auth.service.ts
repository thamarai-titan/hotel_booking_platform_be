import { da } from "zod/locales"
import { prisma } from "../db/prisma.ts"
import type { loginSchemaType, signupSchemaType } from "../schemas/auth.schema.ts"
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
        throw error
    }

    
}

export const loginUser = async (data:loginSchemaType)=>{
    const {email,password} = data

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if(!user){
        throw new Error("INVALID_CREDENTIALS")
    }

    const inValidPassword = await bcrypt.compare(data.password, user.password)

    if(!inValidPassword){
        throw new Error("INVALID_CREDENTIALS")
    }

    return user
}   