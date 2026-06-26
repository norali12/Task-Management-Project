import express from "express"

import {login, signup,} from "../controllers/auth.controller.js" ;
import {validate} from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";



const router = express.Router()

router.post("/signup", validate(registerSchema),signup )   
 
router.post("/login", validate(loginSchema), login )

// router.post("/logout", )

// router.post("/refresh-token")

// router.post("/forget-password", )

// router.post("/verify-otp", )

// router.post("/reset-password", )

// router.post("/verify-email",)

// router.get("/me", )




export default router;
