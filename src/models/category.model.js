import { Schema } from "mongoose";
import mongoose from "mongoose";

const categorySchema = new Schema(
    {
        CategoryName: {
            type: String,
            required: true
        },
        image: {
            type: {
                url: String,
            }
        }
    },
    {
        timestamps: true
    }
)

export const Category = mongoose.model("Category", categorySchema)