import { Schema } from "mongoose";
import mongoose from "mongoose";

const materialSchema = new Schema(
    {
        materialName: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Material = mongoose.model("Material", materialSchema)