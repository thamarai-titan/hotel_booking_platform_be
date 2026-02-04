import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
                userId: string;
                role: string;
        }
    }
}
export const verifyUser = async (req:Request, res:Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({
            success:false,
            data:null,
            error: "UNAUTHORIZED"
        })
    }
    const token = authHeader.split(" ")[1] as string;
    try {
        const decoded  = jwt.verify(token, process.env.JWT_SECRET!) as {
            role: string;userId: string
}
        req.userId = decoded.userId
        req.role = decoded.role
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            data: null,
            error: "UNAUTHORIZED"
        })
    }
}   

export const requireOwner = (req:Request, res:Response, next:NextFunction)=>{
    if(req.role !== "owner"){
        return res.status(403).json({
            success:false,
            data: null,
            error: "FORBIDDEN"
        })
    }
    next()
}

export const requireCustomer = (req:Request, res:Response, next:NextFunction)=>{
    if(req.role !== "customer"){
        return res.status(403).json({
            success:false,
            data: null,
            error: "FORBIDDEN"
        })
    }
    next()
}