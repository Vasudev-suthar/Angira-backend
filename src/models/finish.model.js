import { Schema } from "mongoose";
import mongoose from "mongoose";

const finishSchema = new Schema(
    {
        finishName: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Finish = mongoose.model("Finish", finishSchema)