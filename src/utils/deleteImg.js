import fs from "fs"

const deleteImage = async (localFilePath) => {
    try {
        fs.unlinkSync(localFilePath)
        return { success: true, path: localFilePath };
    } catch (error) {
        return { success: false, error: error.message, path: localFilePath };
    }
}

export { deleteImage }