import { Schema } from "mongoose";
import mongoose from "mongoose";

const contactUsSchema = new Schema(
    {
        Address: {
            type: String,
            required: true
        },
        BranchAddress: {
            type: String,
            required: true
        },
        EmailAddress: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
)

export const Contactus = mongoose.model("Contactus", contactUsSchema)