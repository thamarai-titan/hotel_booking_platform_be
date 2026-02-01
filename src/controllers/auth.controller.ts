import type {Request, Response} from "express"
import { signupSchema, type signupSchemaType } from "../schemas/auth.schema"
import { createUser } from "../services/auth.service"
import { Prisma } from "@prisma/client"


export const SignUpController = async (req:Request, res:Response)=>{
    const data:signupSchemaType = signupSchema.parse(req.body)
    try {
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