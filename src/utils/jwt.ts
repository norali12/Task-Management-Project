import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (
  payload: JwtPayload
): string => {
  const token: string = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "15m",
    }
  );
  return token;
};

export const generateRefreshToken = (
  payload: JwtPayload
): string => {
  const token: string = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

export const verifyToken = (
  token: string,
  secret: string
) => {
  return jwt.verify(token, secret);
};