import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import dotenv from "dotenv"
import { Admin } from '../models/admin.model.js';
import { validationResult } from 'express-validator'

dotenv.config({
    path: './env'
})

const register = asyncHandler(async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
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

export {
    register,
    login
}