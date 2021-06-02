import { useState, useEffect } from "react";
import axios from "axios";
import "./Obras.css";
import Cover from "../components/Cover";

const Obras = () => {
  const [obras, setObras] = useState([]);

  async function fetchData() {
    try {
      const res = await axios.get(`http://localhost:5000/obras`);
      setObras(
        res.data.map((obra) => {
          return (
            <Cover
              path={obra.cover[0].path}
              title={obra.title}
              key={obra._id}
              id={obra._id}
            />
          );
        })
      );
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div>{obras}</div>
    </div>
  );
};

export default Obras;
