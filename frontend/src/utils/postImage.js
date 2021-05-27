import axios from "axios";

async function postImage({ images }) {
  console.log(images);
  const formData = new FormData();
  for (let i = 0; i < images.length; i++) {
    formData.append("images", images[i]);
  }

  for (var value of formData.values()) {
    console.log(value);
    console.log("culo");
  }

  const result = await axios.post("http://localhost:5000/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return result.data;
}

export default postImage;
