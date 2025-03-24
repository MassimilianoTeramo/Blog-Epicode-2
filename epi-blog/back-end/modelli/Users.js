import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Editor'],
        default: "Editor",
    },
    profileImage:{
        type: String,
    },
    profile: String,
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }
    
},{timestamps: true});

export default model("User", userSchema);