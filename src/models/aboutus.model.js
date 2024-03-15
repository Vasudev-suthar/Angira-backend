import { Schema } from "mongoose";
import mongoose from "mongoose";

const aboutUsSchema = new Schema(
    {
        aboutus: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Aboutus = mongoose.model("Aboutus", aboutUsSchema)