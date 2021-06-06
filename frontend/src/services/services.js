import axios from "axios";

function postData({ title, subtitle, year, text, coverToUpload, imagesToUpload }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("subtitle", subtitle);
  formData.append("year", year);
  formData.append("text", text);
  formData.append("cover", coverToUpload);
  for (let image of imagesToUpload) {
    formData.append("images", image);
  }

  return axios.post("http://localhost:5000/obras", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

function updateData({ title, subtitle, year, text, coverToUpload, imagesToUpload, obraId }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("subtitle", subtitle);
  formData.append("year", year);
  formData.append("text", text);
  formData.append("cover", coverToUpload);
  for (let image of imagesToUpload) {
    formData.append("images", image);
  }

  return axios.put(`http://localhost:5000/obras/${obraId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

function fetchData(section) {
  return axios.get(`http://localhost:5000/${section}`);
}

function deleteData(section, id) {
  return axios.delete(`http://localhost:5000/${section}/${id}`);
}

function deleteImage(section, modelId, imageId, key, coverFlag) {
  return axios.delete(
    `http://localhost:5000/${section}/images/${key}?section=${section}&modelId=${modelId}&imageId=${imageId}&coverFlag=${coverFlag}`
  );
}

export { fetchData, postData, deleteImage, updateData, deleteData };
