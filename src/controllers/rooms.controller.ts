import type { Request, Response  } from "express"
import { roomsSchema, type roomsSchemaType } from "../schemas/rooms.schema"
import { createRoomForHotels } from "../services/rooms.service"

export type Params = {
    hotelId: string
}
export const addRoomtoHotels = async (req:Request<Params>, res:Response)=>{
    try {
        const data: roomsSchemaType = roomsSchema.parse(req.body)
        const { hotelId } = req.params
        if(!hotelId){
            return res.status(400).json({
                successs:false,
                data:null,
                error: "HOTEL_NOT_FOUND"
            })
        }
        const room = await createRoomForHotels(data, hotelId)

        res.status(201).json({
            success: true,
            data: {
                id: room.id,
                hotelId: room.hotel_id,
                roomNumber: room.room_number,
                roomType: room.room_type,
                pricePerNight: room.price_per_night,
                maxOccupancy: room.max_occupancy
            }
        })
    } catch (error: any) {
        if(error?.name === "ROOM_ALREADY_EXISTS"){
             return res.status(400).json({
                success: false,
                data: null,
                error: "ROOM_ALREADY_EXISTS"
             })
        }

        if(error?.name === "ZodError"){
            return res.status(400).json({
                success: false,
                data:null,
                error: error
            })
        }

        res.status(400).json({
            success: false,
            data: null,
            error: "ERROR"
        })
    }
    
}