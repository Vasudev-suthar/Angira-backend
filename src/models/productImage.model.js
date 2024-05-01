import { Schema } from "mongoose";
import mongoose from "mongoose";

const productImageSchema = new Schema(
    {
        ProductID: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        images: [
            {
                type: {
                    url: String,
                },
                required: true
            }
        ]
    },
    {
        timestamps: true
    }
)

export const ProductImage = mongoose.model("ProductImage", productImageSchema)