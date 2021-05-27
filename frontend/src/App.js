import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import postImage from "./utils/postImage";
import ImageList from "./components/ImageList";
import axios from "axios";

import "./App.css";

function App() {
  const [file, setFile] = useState();
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageList, setImageList] = useState([]);

  async function fetchData() {
    try {
      const res = await axios.get("http://localhost:5000/images");
      console.log(res.data);
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
      const result = await postImage({ image: file, description });
      console.log(result);
      setIsLoading(false);
      setFeedback("Image successfully uploaded.");
      fetchData();
    } catch (e) {
      console.log(e.message + " error en react");
      setFeedback("Upload failed. Please try again.");
      setIsLoading(false);
    }
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
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
