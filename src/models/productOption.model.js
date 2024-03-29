import { Schema } from "mongoose";
import mongoose from "mongoose";

const productOptionSchema = new Schema(
    {
        ProductID: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        Tops: [
            {
                topname: {
                    type: String,
                    required: true
                },
                topsimg: {
                    type: {
                        url: String
                    },
                    required: true
                }
            }
        ],
        Edges: [
            {
                edgename: { 
                    type: String,
                    required: true
                },
                edgesimg: {
                    type: {
                        url: String
                    },
                    required: true
                }
            }
        ],
        Finish: [
            {
                finishname: {
                    type: String,
                    required: true
                },
                finishimg: {
                    type: {
                        url: String
                    },
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

export const Productoption = mongoose.model("Productoption", productOptionSchema)