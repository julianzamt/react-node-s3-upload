import Image from "../components/Image";
import axios from "axios";

async function fetchImages(query) {
  try {
    const res = await axios.get(`http://localhost:5000/images/${query}`);

    const images = res.data.map((item) => (
      <Image path={item.path} key={item.path} />
    ));
    const imagesData = res.data;
    return { images, imagesData };
  } catch (e) {
    console.log(e + " de fetchImages");
  }
}

async function fetchData(query) {
  try {
    const res = await axios.get(`http://localhost:5000/images/${query}`);
    return res;
  } catch (e) {
    console.log(e.message);
  }
}

async function fetchImagesNames() {
  try {
    const res = await axios.get(`http://localhost:5000/images/names`);
    return res;
  } catch (e) {
    console.log(e.message);
  }
}

export { fetchImages, fetchData, fetchImagesNames };
