import axios, { type AxiosResponse } from 'axios'
import { toast } from 'sonner'
import type { CloudinaryUploadResponse } from '../types/general'

export const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'ml_default')

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

  if (!cloudName && !file) {
    console.error('Cloudinary cloud name is not defined in environment variables')
    return
  }
  try {
    const response: AxiosResponse<CloudinaryUploadResponse> = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      formData
    )
    if (response.status === 200) {
      // toast.success('Upload successful')
      return response.data
    } else {
      toast.error('Upload not successful, try again!')
    }
  } catch (error) {
    toast.error('Upload not successful, try again!')
    console.error('Upload error:', error)
  }
}

// const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     setUploadingImage(true)
//     if (file) {
//         handleUpload(file)
//     }
// }

//Images Upload Functionality
// const [uploadingImage, setUploadingImage] = useState(false)
// const handleUpload = async (file: File) => {
//     try {
//         const response = await uploadFile(file)
//         if (response?.secure_url) {
//             setProduct({ ...product, productImages: [...product.productImages, response.secure_url] })
//         }
//     } catch (error) {
//         console.error('Error uploading file:', error)
//     } finally {
//         setUploadingImage(false) // Stop the loading spinner
//     }
// }
