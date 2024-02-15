import { Schema } from "mongoose";
import mongoose from "mongoose";

const productOptionSchema = new Schema({
    ProductName: {
        type: String,
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
                    url: String,
                    public_id: String,
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
                    url: String,
                    public_id: String,
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
                    url: String,
                    public_id: String,
                },
                required: true
            }
        }
    ]
})

export const Productoption = mongoose.model("Productoption", productOptionSchema)