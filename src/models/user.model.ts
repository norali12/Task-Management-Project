import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  Name:{
    type: String,
    required:true
  },
  Email:{
    type: String,
    required:true,
    unique:true
  },
  Password:{
    type: String,
    required:true,
    minlength:6
  },
  Role:{
    type: String,
    enum:["Admin","Member"],
    default:"Member"
  },
  isVerified:{   
    type: Boolean,
    default:false
  },
  emailVerificationOTP:{
    type: String,
  },
  emailVerificationOTPExpiry:{
    type: Date,
  },
  resetPasswordOTP:{
    type: String,
  },
  resetPasswordOTPExpiry:{
    type: Date,
  },
  refreshToken:{
    type: String,
  },
  refreshTokenExpiry:{
    type: Date,
  }
  
}
,{timestamps:true}
);



const User = mongoose.model("User",userSchema);

export default User;