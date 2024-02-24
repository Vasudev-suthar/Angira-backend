import fs from "fs"

const deleteImage = async (localFilePath) => {
    try {
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        return error
    }
}

export { deleteImage }