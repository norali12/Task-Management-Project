import { Response } from "express";

export const setRefreshTokenCookie = (
  res: Response,
  token: string
) => {

  res.cookie(
    "refreshToken",
    token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",

      maxAge:
        7 * 24 * 60 * 60 * 1000,
    }
  );
};

export const clearRefreshTokenCookie = (
  res: Response
): void => {

  res.clearCookie(
    "refreshToken"
  );

};
//اقارن بين استخدام الفانكشن دي واني اخلي ال maxAge=0 في ال controller in the logout