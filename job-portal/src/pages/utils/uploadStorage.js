// import { API_PATHS } from "./apiPath";
// import axiosInstance from "./axiosInstance";

// const uploadImage = async (imgFile) => {
//   const formData = new FormData();
//   formData.append("image", imgFile);

//   try {
//     // Do NOT manually set Content-Type here
//     const response = await axiosInstance.post(
//       API_PATHS.IMAGE.UPLOAD_IMAGE,
//       formData
//     );
//     return response.data;
//   } catch (err) {
//     // <-- Replace your old catch with this
//     console.error("REGISTER ERROR:", err); // this logs the actual error
//     res.status(500).json({ message: err.message });
//   }
  
//   // catch (error) {
//   //   console.error("Error uploading the image", error);
//   //   throw error;
//   // }
// };

//export default uploadImage;

import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imgFile) => {
  const formData = new FormData();
  // append img file to form data
  formData.append("image", imgFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // set header for file upload
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading the image", error);
    throw error; // Rethrow error for handling
  }
};
export default uploadImage;
