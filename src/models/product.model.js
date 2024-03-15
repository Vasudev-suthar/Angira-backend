import { Schema } from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema(
    {
        CategoryName: {
            type: String,
            enum: ['Dining Table', 'Stool', 'Coffee Table', 'Metal Leg'],
            required: true
        },
        ProductName: {
            type: String,
            required: true,
            unique: true
        },
        img: {
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

export const Product = mongoose.model("Product", productSchema)