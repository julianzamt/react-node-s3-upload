import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import postImage from "./utils/postImage";
import ImageList from "./components/ImageList";
import axios from "axios";

import "./App.css";

function App() {
  const [files, setFiles] = useState();
  // const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageList, setImageList] = useState([]);

  async function fetchData() {
    try {
      const res = await axios.get("http://localhost:5000/images");
      console.log(res.data + " Lo que hay en Mongo");
      setImageList(
        res.data.map((item) => (
          <ImageList
            originalName={item.originalName}
            path={item.path}
            key={item.path}
          />
        ))
      );
    } catch (e) {
      console.log(e + " Fetch de React");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setFeedback("");
      setIsLoading(true);
      //const result = await postImage({ image: files, description });
      const result = await postImage({ images: files });
      console.log(result);
      setIsLoading(false);
      setFeedback("Images successfully uploaded.");
      fetchData();
    } catch (e) {
      console.log(e.message + " error en react");
      setFeedback("Upload failed. Please try again.");
      setIsLoading(false);
    }
  };

  const filesSelected = (event) => {
    setFiles(event.target.files);
  };

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input
          onChange={filesSelected}
          type="file"
          accept="image/*"
          multiple
        ></input>

        {isLoading ? (
          <Spinner animation="grow" />
        ) : (
          <button type="submit">Submit</button>
        )}
      </form>
      {feedback ? <div>{feedback}</div> : null}
      <div style={{ border: "1px solid black", margin: "1em", padding: "1em" }}>
        {imageList}
      </div>
    </div>
  );
}

export default App;
