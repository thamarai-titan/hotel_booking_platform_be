import {Router} from 'express'
import { SignUpController } from '../controllers/auth.controller'

const router = Router()

router.post("/signup", SignUpController)


export default router