import ImageModel from "../models/image.model.js"

export const uploadFileService = async(data) =>{
    const image = {
        image_url:data?.path,
        name:data?.originalname
    }
    const newImage = await ImageModel.create(image)
    return newImage
}
export default {
    uploadFileService
}