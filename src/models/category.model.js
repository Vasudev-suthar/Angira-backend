import { Schema } from "mongoose";
import mongoose from "mongoose";

const categorySchema = new Schema(
    {
        CategoryName: {
            type: String,
            enum: ['Dining Table', 'Stool', 'Coffee Table', 'Metal Leg'],
            required: true
        },
        image: {
            type: {
                url: String,
            },
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Category = mongoose.model("Category", categorySchema)