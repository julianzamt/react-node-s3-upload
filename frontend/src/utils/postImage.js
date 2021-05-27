import axios from "axios";

async function postImage({ image, description }) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("description", description);

  const result = await axios.post("http://localhost:5000/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return result.data;
}

export default postImage;
