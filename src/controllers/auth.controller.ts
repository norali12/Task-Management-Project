
import { Request, Response } from "express";

import { loginService, signupService } from "../services/auth.services.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../utils/cookies.js";

export const signup = async (
    req: Request,
    res: Response
) => {

    try {

        const { user, emailSent } =
            await signupService(req.body);

        if (!emailSent) {
            return res.status(201).json({
                success: true,
                message:
                    "Account created successfully, but we failed to send the verification email.",
                data: user,
            });
        }

        return res.status(201).json({
            success: true,
            message:
                "Account created successfully. Please verify your email.",
            data: user,
        });

    } catch (error) {

        console.error("Signup error:", error);

        if (error instanceof Error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const login = async (req: Request, res: Response) => {
  try {
     const result = await loginService(req.body);
     setRefreshTokenCookie( res, result.refreshToken);
     return res.status(200).json({
            success: true,
            accessToken:result.accessToken,
            user: result.userWithoutPassword});
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof Error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// export const logout = async (req: Request, res: Response) => {
//     try {
        
//     } catch (error) {
        
//     }


//     await logoutService(req);

// clearRefreshTokenCookie(res);

// res.json({

// success:true

// });
// }


