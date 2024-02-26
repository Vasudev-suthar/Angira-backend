import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import dotenv from "dotenv"
import { Admin } from '../models/admin.model.js';
import { validationResult } from 'express-validator'
import { isValidObjectId } from "mongoose"

dotenv.config({
    path: './env'
})

const register = asyncHandler(async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiResponse(400, { errors: errors.array() }));
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    let user = await Admin.findOne({ email });

    if (user) {
        throw new ApiError(400, 'User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
        username,
        email,
        password: hashedPassword
    });

    const createAdmin = await Admin.findById(admin._id).select(
        "-password "
    )

    if (!createAdmin) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    return res.status(201).json(
        new ApiResponse(200, createAdmin, "Admin registered successfully")
    )

})

const login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await Admin.findOne({ $or: [{ username }, { email }] });

    if (!user) {
        throw new ApiError(400, "Admin does not exixt");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const loggedInUser = await Admin.findById(user._id).select("-password")
    return res
        .status(201)
        .cookie("Token", token)
        .json(
            new ApiResponse(200, loggedInUser, "Admin logged in Successfully")
        )

});

const changePassword = asyncHandler(async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiResponse(400, { errors: errors.array() }));
    }

    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await Admin.findById(id);

    if (!user) {
        throw new ApiError(404, "Admin not found");
    }

    // Check if the old password matches
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Old password is incorrect");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await Admin.findByIdAndUpdate(id, { password: hashedPassword });

    return res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});

const getAdmin = asyncHandler(async (req, res) => {
    const user = await Admin.find().select(
        "-password "
    )

    if (!user) {
        throw new ApiError(400, "Admin are not found")
    }

    else if (user.length > 0) {
        res.status(201).json(
            new ApiResponse(200, user, "Admin fetched successfully")
        )
    }

    else {
        res.status(201).json(
            new ApiResponse(200, "currantly have not any admin")
        )
    }
});

const deleteAdmin = asyncHandler(async (req, res) => {

    const { adminId } = req.params

    if (!isValidObjectId(adminId)) {
        throw new ApiError(400, "Invalid adminId");
    }

    const product = await Admin.findById(adminId);

    if (!product) {
        throw new ApiError(404, "No Admin found");
    }

    const deleteAdmin = await Admin.findByIdAndDelete(adminId).select(
        "-password "
    );

    if (!deleteAdmin) {
        throw new ApiError(500, "Failed to delete Admin please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deleteAdmin, "Admin deleted successfully"));
})

const updateAdminDetails = asyncHandler(async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiResponse(400, { errors: errors.array() }));
    }

    const { adminId } = req.params
    const { username, email } = req.body;

    if (!isValidObjectId(adminId)) {
        throw new ApiError(400, "Invalid adminId");
    }

    if (!(username && email)) {
        throw new ApiError(400, "username and email are required");
    }

    const user = await Admin.findById(adminId);

    if (!user) {
        throw new ApiError(404, "No product found");
    }

    const updateUser = await Admin.findByIdAndUpdate(
        adminId,
        {
            $set: {
                username,
                email
            }
        },
        { new: true }
    ).select(
        "-password "
    );

    if (!updateUser) {
        throw new ApiError(500, "Failed to update Admin details please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateUser, "Admin updated successfully"));
})


export {
    register,
    login,
    changePassword,
    getAdmin,
    deleteAdmin,
    updateAdminDetails
}