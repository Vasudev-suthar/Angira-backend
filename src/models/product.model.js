import { Schema } from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema({
    CategoryName: {
        type: String,
        required: true
    },
    ProductName: {
        type: String,
        required: true
    },
    img: {
        type: {
            url: String,
            public_id: String,
        },  // cloudinary url
        required: true
    }
})

export const Product = mongoose.model("Product", productSchema)