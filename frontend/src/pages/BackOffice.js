import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import postImage from "../utils/postImage";
import { fetchImagesNames } from "../utils/fetchData";

const BackOffice = () => {
  const [files, setFiles] = useState();
  const [feedback, setFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCover, setIsCover] = useState(false);
  const [category, setCategory] = useState("obras");
  const [imagesList, setImagesList] = useState([]);

  useEffect(() => {
    setImagesList(fetchImagesNames());
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setFeedback("");
      setIsLoading(true);
      //const result = await postImage({ image: files, description });
      const result = await postImage({ images: files });
      console.log(result);
      setIsLoading(false);
      setFeedback("Images successfully uploaded.");
      fetchImagesNames();
    } catch (e) {
      console.log(e.message + " error en react");
      setFeedback("Upload failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    if (name === "files") {
      setFiles(event.target.files);
    } else if (name === "isCover") {
      setIsCover(event.target.checked);
    } else if (name === "category") {
      setCategory(event.target.value);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="file"
          accept="image/*"
          name="files"
          multiple
        ></input>
        <label htmlFor="category">Choose a category:</label>
        <select
          onChange={handleChange}
          name="category"
          id="category"
          required
          value={category}
        >
          <option value="obras">Obras</option>
          <option value="proyectos">Proyectos</option>
          <option value="equipamiento">Equipamiento</option>
          <option value="producto">Producto</option>
          <option value="documentacion">Documentación</option>
        </select>

        <label htmlFor="isCover">Cover Image?</label>
        <input
          type="checkbox"
          checked={isCover}
          onChange={handleChange}
          name="isCover"
          id="setIsCover"
        />

        {isLoading ? (
          <Spinner animation="grow" />
        ) : (
          <button type="submit">Submit</button>
        )}
      </form>
      {feedback ? <div>{feedback}</div> : null}
      <div style={{ border: "1px solid black", margin: "1em", padding: "1em" }}>
        {imagesList}
      </div>
    </div>
  );
};

export default BackOffice;
