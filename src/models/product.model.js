import { Schema } from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema(
    {
        category: {
            type: String,
            enum: ['Dining Table', 'Stool', 'Coffee Table', 'Metal Leg'],
            required: true
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        productCode: {
            type:String,
            required: true,
            unique:true
        },
        hsn: {
            type:String,
            required:true
        },
        topFinish:{
            type:String,
            required:true
        },
        legFinish:{
            type:String,
            required:true
        },
        topMaterial:{
            type:String,
            required:true
        },
        legMaterial:{
            type:String,
            required:true
        },
        size:{
            type:String,
            required:true
        },
        cbm:{
            type:String,
            required:true
        },
        grossWeight:{
            type:String,
            required:true
        },
        netWeight:{
            type:String,
            required:true
        },
        price:{
            type:String,
            required:true
        },
        Public: {
            type: Boolean,
            default: false,
            required:true
        },
        newBadge: {
            type: Boolean,
            default: false,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        remark:{
            type:String,
            required:true
        }
        // img: {
        //     type: {
        //         url: String,
        //     },
        //     required: true
        // }
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema)