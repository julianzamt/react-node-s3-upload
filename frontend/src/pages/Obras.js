import { useState, useEffect } from "react";
import { fetchData } from "../services/services";
import "./Obras.css";
import Cover from "../components/Cover";

const Obras = () => {
  const [covers, setCovers] = useState([]);

  async function fetchCovers() {
    try {
      const obras = await fetchData("obras");
      setCovers(
        obras.data.map(obra => {
          if (obra.cover[0]) {
            return <Cover path={obra.cover[0].path} title={obra.title} key={obra._id} id={obra._id} />;
          } else {
            return <Cover path={null} title={obra.title} key={obra._id} id={obra._id} />;
          }
        })
      );
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchCovers();
  }, []);

  return (
    <div>
      <div>{covers}</div>
    </div>
  );
};

export default Obras;
