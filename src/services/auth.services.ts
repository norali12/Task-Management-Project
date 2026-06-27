import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateOTP } from "../utils/otp.js";
import { sendEmail } from "../utils/email.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";


interface SignupData {
  Name: string;
  Email: string;
  Password: string;
}

interface LoginData{
    Email:string
    Password:string
}


export const signupService = async (
    data: SignupData
) => {

    const existingUser = await User.findOne({
    Email: data.Email,
});

if (existingUser) {
    throw new Error("Email already exists");
}

const hashedPassword =
    await bcrypt.hash(data.Password, 10);

const otp = generateOTP();

const otpExpiry = new Date(
    Date.now() + 10 * 60 * 1000
);

const user = await User.create({
    Name: data.Name,

    Email: data.Email,

    Password: hashedPassword,

    emailVerificationOTP: otp,

    emailVerificationOTPExpiry: otpExpiry,
});

let emailSent = true;
try {
    await sendEmail(
        user.Email,

        "Verify your email",

        `
        <h2>Hello ${user.Name}</h2>

        <p>Your verification code is:</p>

        <h1>${otp}</h1>

        <p>This code expires in 10 minutes.</p>
        `
    );
} catch (error) {
    console.error("Email verification send failed:", error);
    emailSent = false;
}


const userWithoutPassword = await User.findById(user._id).select("-Password"); 

return {
    user: userWithoutPassword,
    emailSent
};



}


export const loginService = async (
    data: LoginData
) => {

    const user = await User.findOne({ Email:data.Email});

    if(!user){
    throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(data.Password, user.Password);
    if (!isMatch) {
        throw new Error("Password is not correct");
    }
    
    if(!user.isVerified){
        throw new Error("Please verify your email first");
    }
     
    const accessToken = generateAccessToken({
        userId:user._id.toString(),
        role:user.Role
    });

    const refreshToken = generateRefreshToken({
          userId:user._id.toString(),
          role:user.Role
    });
    
    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = new Date( Date.now() + 7*24*60*60*1000);
    await user.save();

const userObj = user.toObject();
    const { Password, refreshToken: _, refreshTokenExpiry: __, emailVerificationOTP:___, emailVerificationOTPExpiry:____, ...userWithoutPassword } = userObj;
    return{
        userWithoutPassword,
        accessToken,
        refreshToken
    }

}


// export const logoutService = async () => {
// };

