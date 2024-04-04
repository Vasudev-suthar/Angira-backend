import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import dotenv from "dotenv"
import { User } from '../models/user.model.js';
import { validationResult } from 'express-validator'
import { isValidObjectId } from "mongoose"

dotenv.config({
    path: './env'
})

const registerUser = asyncHandler(async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiResponse(400, { errors: errors.array() }));
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    let user = await User.findOne({ email });

    if (user) {
        throw new ApiError(400, 'User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword
    });

    const createnewUser = await User.findById(newUser._id).select(
        "-password "
    )

    if (!createnewUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(201)
    // .cookie("token", token)
    .json(
        new ApiResponse(200,{"token":token},createnewUser, "User registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
        throw new ApiError(400, "User does not exixt");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const loggedInUser = await User.findById(user._id).select("-password")
    return res
        .status(201)
        // .cookie("token", token)
        .json(
            new ApiResponse(200,{"token":token},loggedInUser, "User logged in Successfully")
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
    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if the old password matches
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Old password is incorrect");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    return res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});

const getUser = asyncHandler(async (req, res) => {
    const user = await User.find().select(
        "-password "
    )

    if (!user) {
        throw new ApiError(400, "User are not found")
    }

    else if (user.length > 0) {
        res.status(201).json(
            new ApiResponse(200, user, "User fetched successfully")
        )
    }

    else {
        res.status(201).json(
            new ApiResponse(200, "currantly have not any User")
        )
    }
});

const deleteUser = asyncHandler(async (req, res) => {

    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const product = await User.findById(userId);

    if (!product) {
        throw new ApiError(404, "No User found");
    }

    const deleteUser = await User.findByIdAndDelete(userId).select(
        "-password "
    );

    if (!deleteUser) {
        throw new ApiError(500, "Failed to delete User please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deleteUser, "User deleted successfully"));
})

const updateUserDetails = asyncHandler(async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiResponse(400, { errors: errors.array() }));
    }

    const { userId } = req.params
    const { username, email } = req.body;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    if (!(username && email)) {
        throw new ApiError(400, "username and email are required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "No product found");
    }

    const updateUser = await User.findByIdAndUpdate(
        userId,
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
        throw new ApiError(500, "Failed to update User details please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateUser, "User updated successfully"));
})


export {
    registerUser,
    loginUser,
    changePassword,
    getUser,
    deleteUser,
    updateUserDetails
}