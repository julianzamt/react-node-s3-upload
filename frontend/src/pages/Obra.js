import { useState, useEffect } from "react";
import Image from "../components/Image";
import axios from "axios";

const Obra = props => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");

  async function fetchData() {
    try {
      const res = await axios.get(`http://localhost:5000/obras/${props.match.params.id}`);
      setImages(
        res.data.images.map(image => {
          return <Image path={image.path} key={image._id} />;
        })
      );
      setTitle(res.data.title);
      setSubtitle(res.data.subtitle);
      setYear(res.data.year);
      setText(res.data.text);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div>Obra {title}</div>
      <p>subtitle: {subtitle}</p>
      <p>year: {year}</p>
      <p>text: {text}</p>
      <div>{images}</div>
    </div>
  );
};

export default Obra;
