import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
  role: string;
}


export const protectedRoute = async (req:Request, res:Response, next:NextFunction) =>{

    let token: string | undefined;

    if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; 
  }

  if(!token){
    console.log("Auth middleware Error: No token provided");
    return res.status(401).json({success: false,message:"Unauthorized - No token provided"})
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as DecodedToken;

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next(); 
  } catch (error) {
    
    console.log("Auth error",error);
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: "Not authorized. Token is invalid or expired.",
        });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
  
