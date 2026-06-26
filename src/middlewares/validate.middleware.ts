

import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (
  schema: z.ZodObject
) => {

  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const result =
      schema.safeParse(req.body);

    if (!result.success) {

      return res.status(400).json({
        success: false,
        errors:
          result.error.flatten(),
      });

    }

    console.log("Validation Passed"); 

    req.body = result.data;

    next();
  };

};