

import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (
  schema: z.ZodObject,
) => async (req: Request, res: Response, next: NextFunction) => {

    const result = await schema.safeParseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {

      console.log(result.error.issues);
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.slice(1).join("."),
          message: issue.message,
        })),
      });

    }

    
    console.log("Validation Passed"); 

    
    if (result.data.body !== undefined) {
      req.body = result.data.body;
    }
    if (result.data.params !== undefined) {
      req.params = result.data.params as any;
    }
    if (result.data.query !== undefined) {
      req.query = result.data.query as any;
    }
    
    next();
  };

