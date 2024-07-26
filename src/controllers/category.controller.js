import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Category } from "../models/category.model.js"
import { deleteImage } from "../utils/deleteImg.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"


const addCategory = asyncHandler(async (req, res) => {

    const { CategoryName } = req.body

    if (!CategoryName) {
        throw new ApiError(400, "CategoryName is required");
    }

    const category = await Category.findOne({ CategoryName });
    if (category) {
        throw new ApiError(400, "Category already exists");
    }

    const categoryImgLocalPath = req.files?.image?.[0]?.path;

    if (!categoryImgLocalPath) {
        throw new ApiError(400, "image file is required")
    }

    const newcategory = await Category.create({
        CategoryName,
        image: {
            url: categoryImgLocalPath
        }
    })

    if (!newcategory) {
        throw new ApiError(500, "Something went wrong while adding Category")
    }

    return res.status(201).json(
        new ApiResponse(200, newcategory, "Category added Successfully")
    )

})

const getCategory = asyncHandler(async (req, res) => {
    const categorys = await Category.find()

    if (!categorys) {
        throw new ApiError(400, "categorys are not found")
    }

    else if (categorys.length > 0) {
       return res.status(201).json(
            new ApiResponse(200, categorys, "products fetched successfully")
        )
    }

    else {
       return res.status(201).json(
            new ApiResponse(200, "currantly have not any categorys")
        )
    }
})

const updateCategoryDetails = asyncHandler(async (req, res) => {

    const { categoryId } = req.params
    const { CategoryName } = req.body;

    if (!isValidObjectId(categoryId)) {
        throw new ApiError(400, "Invalid categoryId");
    }

    if (!CategoryName) {
        throw new ApiError(400, "CategoryName is required");
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(404, "No category found");
    }

    // deleting old img and updating with new one
    const imgToDelete = category.image.url
    const categoryImgLocalPath = req.files?.image?.[0]?.path;

    if (!categoryImgLocalPath) {
        throw new ApiError(400, "image file is required")
    }

    const updateCategory = await Category.findByIdAndUpdate(
        categoryId,
        {
            $set: {
                CategoryName,
                image: {
                    url: categoryImgLocalPath
                }
            }
        },
        { new: true }
    );

    if (!updateCategory) {
        throw new ApiError(500, "Failed to update category please try again");
    }

    if (updateCategory) {
        await deleteImage(imgToDelete);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateCategory, "Category updated successfully"));
})

const deleteCategory = asyncHandler(async (req, res) => {

    const { categoryId } = req.params

    if (!isValidObjectId(categoryId)) {
        throw new ApiError(400, "Invalid categoryId");
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(404, "No category found");
    }

    const deletecategory = await Category.findByIdAndDelete(categoryId);

    if (!deletecategory) {
        throw new ApiError(500, "Failed to delete category please try again");
    }

    await deleteImage(category.image.url);

    return res
        .status(200)
        .json(new ApiResponse(200, deletecategory, "Category deleted successfully"));
})

const searchCategory = asyncHandler(async (req, res) => {

    const categorys = await Product.find({
        "$or": [
            { CategoryName: { $regex: (req.params.key, 'i') } }
        ]
    })

    if (!categorys) {
        throw new ApiError(400, "categorys are not found")
    }

    else if (categorys.length > 0) {
       return res.status(201).json(
            new ApiResponse(200, categorys, "categorys fetched successfully")
        )
    }

    else {
       return res.status(201).json(
            new ApiResponse(200, "currantly have not any categorys")
        )
    }
})



export {
    addCategory,
    getCategory,
    updateCategoryDetails,
    deleteCategory,
    searchCategory
}
