import type {Request, Response} from "express"
import { loginSchema, signupSchema, type loginSchemaType, type signupSchemaType } from "../schemas/auth.schema"
import { createUser, loginUser } from "../services/auth.service"
import { Prisma } from "@prisma/client"
import { success } from "zod"
import { use } from "react"
import { signJWT } from "../utils/jwt"


export const SignUpController = async (req:Request, res:Response)=>{
    
    try {
        const data:signupSchemaType = signupSchema.parse(req.body)
        const user = await createUser(data)
        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            },
            error: null
        })
    } catch (err: any) {
        if(err?.name === "ZodError") {
            return res.status(400).json({
                success: false,
                data: null,
                error: "INVALID REQUEST"
            })
        }

        if(err instanceof Prisma.PrismaClientKnownRequestError){
            if(err.code === "P2002"){
                return res.status(400).json({
                    success: false,
                    data: null,
                    error: "EMAIL_ALREADY_EXISTS"
                })
            }
        }

        return res.status(400).json({
            success: false,
            data:null,
            error: "User not created"
        })
    }
}   

export const loginController = async (req:Request, res:Response)=>{
    
    try {
        const data:loginSchemaType = loginSchema.parse(req.body)
        const user = await loginUser(data)
        
        const token = await signJWT({userId: user.id, role: user.role})
        res.status(200).json({
            success: true,
            data: {
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            },
            error:null
        })
    } catch (error: any) {
        if(error?.name === "INVALID_CREDENTIALS"){
            return res.status(401).json({
                success:false,
                data: null,
                error: "INVALID_CREDENTIALS"
            })
        }
        if(error?.name === "ZodError"){
            return res.status(400).json({
                success:false,
                data: null,
                error: "INVALID_REQUEST"
            })
        }
        res.status(500).json({
            success: true,
            data: null,
            error: "INTERNAL_SERVER_ERROR"
        })
    }
}