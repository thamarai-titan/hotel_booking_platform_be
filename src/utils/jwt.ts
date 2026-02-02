import jwt from 'jsonwebtoken'

export const signJWT = async (payload: {userId: string,role: string})=>{
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "7d"
    })
}
