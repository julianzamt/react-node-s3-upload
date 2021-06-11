import axios from "axios";

function postDocument({ title, subtitle, year, text, coverToUpload, imagesToUpload, section }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("subtitle", subtitle);
  formData.append("year", year);
  formData.append("text", text);
  formData.append("cover", coverToUpload);
  for (let image of imagesToUpload) {
    formData.append("images", image);
  }

  return axios.post(`http://localhost:5000/${section}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

function updateDocument({ title, subtitle, year, text, coverToUpload, imagesToUpload, id, section }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("subtitle", subtitle);
  formData.append("year", year);
  formData.append("text", text);
  formData.append("cover", coverToUpload);
  for (let image of imagesToUpload) {
    formData.append("images", image);
  }

  return axios.put(`http://localhost:5000/${section}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

function fetchCollection(section) {
  return axios.get(`http://localhost:5000/${section}`);
}

function deleteDocument(section, id) {
  return axios.delete(`http://localhost:5000/${section}/${id}`);
}

function deleteImage(section, documentId, imageId, key, coverFlag) {
  return axios.delete(
    `http://localhost:5000/${section}/images/${key}?section=${section}&documentId=${documentId}&imageId=${imageId}&coverFlag=${coverFlag}`
  );
}

export { fetchCollection, postDocument, deleteImage, updateDocument, deleteDocument };
