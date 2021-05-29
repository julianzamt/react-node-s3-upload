import axios from "axios";

async function postData({ title, subtitle, year, text, cover, images }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("subtitle", subtitle);
  formData.append("year", year);
  formData.append("text", text);
  formData.append("cover", cover);
  for (let i = 0; i < images.length; i++) {
    formData.append("images", images[i]);
  }

  for (var value of formData.values()) {
    console.log(value);
  }

  const result = await axios.post("http://localhost:5000/obras", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return result.data;
}

export default postData;
