import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const postSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    readTime: {
        value: { type: Number, required: true },
        unit: { type: String, required: true  },
      },
    author: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true
    },
}, {timestamps: true});

export default model("Post", postSchema);