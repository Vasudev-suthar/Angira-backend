import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"
import { Contactus } from "../models/contactus.model.js"

const addContactus = asyncHandler(async (req, res) => {
    const { Address, BranchAddress, EmailAddress } = req.body;

    if (!Address && !BranchAddress && !EmailAddress) {
        throw new ApiError(400, "All field are required");
    }

    const contact = await Contactus.findOne({ Address, BranchAddress, EmailAddress });
    if (contact) {
        throw new ApiError(400, "Contactus already exists");
    }

    const newContactus = await Contactus.create({
        Address,
        BranchAddress,
        EmailAddress
    })

    if (!newContactus) {
        throw new ApiError(500, "Something went wrong while adding Contactus")
    }

    return res.status(201).json(
        new ApiResponse(200, newContactus, "Contactus added Successfully")
    )
})

const getContactus = asyncHandler(async (req, res) => {
    const contactus = await Contactus.find()

    if (!contactus) {
        throw new ApiError(400, "contactus are not found")
    }

    else if (contactus.length > 0) {
        res.status(200).json(
            new ApiResponse(200, contactus, "contactus fetched successfully")
        )
    }

    else {
        res.status(200).json(
            new ApiResponse(200, "currantly have not any contactus")
        )
    }
})

const updateContactus = asyncHandler(async (req, res) => {
    const { contactusId } = req.params
    const { Address, BranchAddress, EmailAddress } = req.body;

    if (!isValidObjectId(contactusId)) {
        throw new ApiError(400, "Invalid contactusId");
    }

    if (!Address && !BranchAddress && !EmailAddress) {
        throw new ApiError(400, "All field are required");
    }

    const contact = await Contactus.findById(contactusId);

    if (!contact) {
        throw new ApiError(404, "No contactus found");
    }

    const updatecontactus = await Contactus.findByIdAndUpdate(
        contactusId,
        {
            $set: {
                Address,
                BranchAddress,
                EmailAddress
            }
        },
        { new: true }
    );

    if (!updatecontactus) {
        throw new ApiError(500, "Failed to update contact us please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatecontactus, "Contact us updated successfully"));
})

const deleteContactus = asyncHandler(async (req, res) => {
    const { contactusId } = req.params

    if (!isValidObjectId(contactusId)) {
        throw new ApiError(400, "Invalid contactusId");
    }

    const contactus = await Contactus.findById(contactusId);

    if (!contactus) {
        throw new ApiError(404, "No Contact us found");
    }

    const deletecontactus = await Contactus.findByIdAndDelete(contactusId);

    if (!deletecontactus) {
        throw new ApiError(500, "Failed to delete contact us please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletecontactus, "Contact us deleted successfully"));
})


export {
    addContactus,
    getContactus,
    updateContactus,
    deleteContactus
}