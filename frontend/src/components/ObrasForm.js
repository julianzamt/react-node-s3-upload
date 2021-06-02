import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import postData from "../utils/postData";
import { fetchData } from "../utils/fetchData";

const ObrasForm = () => {
  const [form, setForm] = useState("");
  const [feedback, setFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [obras, setObras] = useState("");
  const [obra, setObra] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState("");
  const [cover, setCover] = useState(false);

  async function populateObras() {
    const res = await fetchData("obras");
    setObras(res.data.map((item) => item));
  }

  useEffect(() => {
    populateObras();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const action = event.target.id;
    console.log(action);
    if (action === "create") {
      try {
        setFeedback("");
        setIsLoading(true);
        const res = await postData({
          title,
          subtitle,
          year,
          text,
          cover,
          images,
        });
        console.log(res.data);
        setIsLoading(false);
        if (res.status === 200) {
          setFeedback("Images successfully uploaded.");
        } else {
          setFeedback(
            "Something went wrong. Please try again (Seguramente algo con unique. TODO devolver ese error bien"
          );
        }
      } catch (e) {
        console.log(e.message + " error en react");
        setFeedback("Something went wrong. Please try again.");
        setIsLoading(false);
      }
    }
  };

  const handleClick = async (event) => {
    setForm(event.target.id);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    if (name === "images") {
      setImages(event.target.files);
    } else if (name === "cover") {
      setCover(event.target.files[0]);
    } else if (name === "title") {
      setTitle(event.target.value);
    } else if (name === "subtitle") {
      setSubtitle(event.target.value);
    } else if (name === "year") {
      setYear(event.target.value);
    } else if (name === "text") {
      setText(event.target.value);
    } else if (name === "obra") {
      setObra(
        obras.find((item) => {
          console.log(item);
          return item["_id"] === event.target.value;
        })
      );
    }
  };

  return (
    <div>
      <button id="createForm" onClick={handleClick}>
        Crear nueva obra
      </button>
      <button id="editForm" onClick={handleClick}>
        Editar obra
      </button>
      <br></br>

      {/* CREATE */}
      {form === "createForm" && (
        <form onSubmit={handleSubmit} id="create">
          <label htmlFor="title">Nombre corto para portada: </label>
          <input
            type="text"
            required
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Nombre corto"
          />
          <label htmlFor="subtitle">Nombre largo para texto interior: </label>
          <input
            type="text"
            required
            name="subtitle"
            value={subtitle}
            onChange={handleChange}
            placeholder="Nombre largo"
          />
          <label htmlFor="year">Año: </label>
          <input
            type="text"
            required
            name="year"
            value={year}
            onChange={handleChange}
            placeholder="Año"
          />
          <label htmlFor="text">Texto interior: </label>
          <textarea
            required
            name="text"
            value={text}
            onChange={handleChange}
            placeholder="Texto interior"
          />
          <label htmlFor="cover">Imagen de portada: </label>
          <input
            onChange={handleChange}
            type="file"
            accept="image/*"
            name="cover"
          ></input>
          <label htmlFor="images">Imágenes interiores: </label>
          <input
            onChange={handleChange}
            type="file"
            accept="image/*"
            name="images"
            multiple
          ></input>

          {isLoading ? (
            <Spinner animation="grow" />
          ) : (
            <button type="submit">Submit</button>
          )}
          {feedback ? <div>{feedback}</div> : null}
        </form>
      )}

      {/* EDIT */}
      {form === "editForm" && (
        <div>
          <label htmlFor={obra}>Selecciona la obra</label>
          <select onChange={handleChange} name="obra" id="obra" value={obra}>
            <option value="">---</option>
            {obras
              ? obras.map((item) => (
                  <option value={item._id} key={item._id}>
                    {item.title}
                  </option>
                ))
              : null}
          </select>
        </div>
      )}
      {obra ? (
        <form onSubmit={handleSubmit} id="create">
          <label htmlFor="title">Nombre corto para portada: </label>
          <input
            type="text"
            required
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Nombre corto"
          />
          <label htmlFor="subtitle">Nombre largo para texto interior: </label>
          <input
            type="text"
            required
            name="subtitle"
            value={subtitle}
            onChange={handleChange}
            placeholder="Nombre largo"
          />
          <label htmlFor="year">Año: </label>
          <input
            type="text"
            required
            name="year"
            value={year}
            onChange={handleChange}
            placeholder="Año"
          />
          <label htmlFor="text">Texto interior: </label>
          <textarea
            required
            name="text"
            value={text}
            onChange={handleChange}
            placeholder="Texto interior"
          />
          <label htmlFor="cover">Imagen de portada: </label>
          <input
            onChange={handleChange}
            type="file"
            accept="image/*"
            name="cover"
          ></input>
          <label htmlFor="images">Imágenes interiores: </label>
          <input
            onChange={handleChange}
            type="file"
            accept="image/*"
            name="images"
            multiple
          ></input>

          {isLoading ? (
            <Spinner animation="grow" />
          ) : (
            <button type="submit">Submit</button>
          )}
          {feedback ? <div>{feedback}</div> : null}
        </form>
      ) : null}
      {/* <div style={{ border: "1px solid black", margin: "1em", padding: "1em" }}>
        {imagesList}
      </div> */}
    </div>
  );
};

export default ObrasForm;
