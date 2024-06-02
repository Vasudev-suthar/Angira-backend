
import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const productOptionSchema = new Schema({
    ProductID: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    Tops: [
        {
            name: {
                type: String,
                required: true
            },
            displayImage: {
                url: {
                    type: String,
                    required: true
                }
            },
            images: [{
                url: {
                    type: String,
                    required: true
                }
            }]
        }
    ],
    // Edges: [
    //     {
    //         name: {
    //             type: String,
    //             required: true
    //         },
    //         displayImage: {
    //             url: {
    //                 type: String,
    //                 required: true
    //             }
    //         },
    //         images: [{
    //             url: {
    //                 type: String,
    //                 required: true
    //             }
    //         }]
    //     }
    // ],
    // Finish: [
    //     {
    //         name: {
    //             type: String,
    //             required: true
    //         },
    //         displayImage: {
    //             url: {
    //                 type: String,
    //                 required: true
    //             }
    //         },
    //         images: [{
    //             url: {
    //                 type: String,
    //                 required: true
    //             }
    //         }]
    //     }
    // ]
}, {
    timestamps: true
});

export const Productoption = mongoose.model('Productoption', productOptionSchema);
