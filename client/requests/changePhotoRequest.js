import axios from "axios";

const changePhotoReq = async (id, file) => {
  try {
    const formData = new FormData();
    if (file) {
      file = await dataUrlToFile(file, `avatar${id}.png`);
      formData.append("avatar", file);
    }
    console.log(file);
    return await axios.patch(
      `http://localhost:3001/api/v1/user/update/${id}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export async function dataUrlToFile(dataUrl, fileName) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: "image/png" });
}

export default changePhotoReq;
