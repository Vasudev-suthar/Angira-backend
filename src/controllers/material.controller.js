import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Material } from "../models/meterial.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"


const addMaterial = asyncHandler(async (req, res) => {

    const { materialName } = req.body

    if (!materialName) {
        throw new ApiError(400, "materialName is required");
    }

    const material = await Material.findOne({ materialName });
    if (material) {
        throw new ApiError(400, "material already exists");
    }

    const newmaterial = await Material.create({
        materialName
    })

    if (!newmaterial) {
        throw new ApiError(500, "Something went wrong while adding material")
    }

    return res.status(201).json(
        new ApiResponse(200, newmaterial, "material added Successfully")
    )

})

const getMaterial = asyncHandler(async (req, res) => {
    const materials = await Material.find()

    if (!materials) {
        throw new ApiError(400, "materials are not found")
    }

    else if (materials.length > 0) {
        res.status(201).json(
            new ApiResponse(200, materials, "materials fetched successfully")
        )
    }

    else {
        res.status(201).json(
            new ApiResponse(200, "currantly have not any materials")
        )
    }
})

const updateMaterial = asyncHandler(async (req, res) => {

    const { materialId } = req.params
    const { materialName } = req.body;

    if (!isValidObjectId(materialId)) {
        throw new ApiError(400, "Invalid categoryId");
    }

    if (!materialName) {
        throw new ApiError(400, "materialName is required");
    }

    const material = await Material.findById(materialId);

    if (!material) {
        throw new ApiError(404, "No category found");
    }

    const updatematerial = await Material.findByIdAndUpdate(
        materialId,
        {
            $set: {
                materialName
            }
        },
        { new: true }
    );

    if (!updatematerial) {
        throw new ApiError(500, "Failed to update material please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatematerial, "material updated successfully"));
})

const deleteMaterial = asyncHandler(async (req, res) => {

    const { materialId } = req.params

    if (!isValidObjectId(materialId)) {
        throw new ApiError(400, "Invalid materialId");
    }

    const material = await Material.findById(materialId);

    if (!material) {
        throw new ApiError(404, "No material found");
    }

    const deletematerial = await Material.findByIdAndDelete(materialId);

    if (!deletematerial) {
        throw new ApiError(500, "Failed to delete material please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletematerial, "material deleted successfully"));
})

const searchMaterial = asyncHandler(async (req, res) => {

    const materials = await Material.find({
        "$or": [
            { materialName: { $regex: (req.params.key, 'i') } }
        ]
    })

    if (!materials) {
        throw new ApiError(400, "materials are not found")
    }

    else if (materials.length > 0) {
        res.status(201).json(
            new ApiResponse(200, materials, "materials fetched successfully")
        )
    }

    else {
        res.status(201).json(
            new ApiResponse(200, "currantly have not any materials")
        )
    }
})



export {
    addMaterial,
    getMaterial,
    updateMaterial,
    deleteMaterial,
    searchMaterial
}