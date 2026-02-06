import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [60, "Age cannot exceed 60"],
    },
  },
  {
    timestamps:true,
  },
);

export const UserModel =  mongoose.models.User || mongoose.model('User',userSchema)
