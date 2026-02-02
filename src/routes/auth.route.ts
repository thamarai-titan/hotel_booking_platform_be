import { Router } from 'express'
import { loginController, SignUpController } from '../controllers/auth.controller'

const router = Router()

router.post("/signup", SignUpController)
router.post("/login", loginController)


export default router