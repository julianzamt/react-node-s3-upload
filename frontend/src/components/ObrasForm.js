import { useState, useEffect, useRef } from "react";
import Spinner from "react-bootstrap/Spinner";
import { postData, fetchData, deleteImage, updateData, deleteData } from "../services/services";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import FormFile from "react-bootstrap/FormFile";
import { errorMessages } from "../utils/errorMessages";
import "./ObrasForm.css";

const ObrasForm = () => {
  const [form, setForm] = useState("");
  const [feedback, setFeedback] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [obras, setObras] = useState("");
  const [obra, setObra] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState("");
  const [imagesToUpload, setImagesToUpload] = useState("");
  const [cover, setCover] = useState("");
  const [coverToUpload, setCoverToUpload] = useState("");

  const coverRef = useRef();
  const imagesRef = useRef();

  async function fetchObras() {
    const res = await fetchData("obras");
    setObras(res.data.map(item => item));
  }

  function resetFields() {
    setTitle("");
    setSubtitle("");
    setYear("");
    setText("");
    setImagesToUpload("");
    setCoverToUpload("");
    setObra("");
    setFeedback("");
    setSuccess(false);
  }

  useEffect(() => {
    fetchObras();
  }, []);

  useEffect(() => {
    if (obra) {
      setTitle(obra.title);
      setSubtitle(obra.subtitle);
      setYear(obra.year);
      setText(obra.text);
      setImages(obra.images);
      setCover(obra.cover[0]);
    }
  }, [obra]);

  const handleSubmit = async event => {
    event.preventDefault();
    console.log(event.target);
    const action = event.target.id;
    setFeedback("");
    setIsLoading(true);
    if (action === "create") {
      try {
        const res = await postData({ title, subtitle, year, text, coverToUpload, imagesToUpload });
        if (res.status === 200) {
          fetchObras();
          setFeedback("Nueva obra creada con éxito");
          setIsLoading(false);
          setSuccess(true);
          setForm("");
          // set to "" uncontrolled file inputs
          coverRef.current.value = "";
          imagesRef.current.value = "";
        } else {
          coverRef.current.value = "";
          imagesRef.current.value = "";
          setFeedback(errorMessages.ERROR);
          setIsLoading(false);
        }
      } catch (e) {
        console.log(e);
        coverRef.current.value = "";
        imagesRef.current.value = "";
        setFeedback(errorMessages.ERROR);
        setIsLoading(false);
      }
    } else if (action === "update") {
      const obraId = obra._id;
      try {
        const res = await updateData({ title, subtitle, year, text, coverToUpload, imagesToUpload, obraId });
        if (res.status === 200) {
          fetchObras();
          setObra(res.data);
          setImagesToUpload("");
          setCoverToUpload("");
          setFeedback("Obra actualizada con éxito");
          setIsLoading(false);
          coverRef.current.value = "";
          imagesRef.current.value = "";
        } else {
          setFeedback(errorMessages.ERROR);
          coverRef.current.value = "";
          imagesRef.current.value = "";
          setIsLoading(false);
        }
      } catch (e) {
        console.log(e);
        coverRef.current.value = "";
        imagesRef.current.value = "";
        setFeedback(errorMessages.ERROR);
        setIsLoading(false);
      }
    } else if (action === "deleteImage" || action === "deleteCover") {
      let coverFlag = false;
      const key = event.target.value;
      const imageId = event.target.name;
      if (action === "deleteCover") coverFlag = true;
      try {
        const res = await deleteImage("obras", obra._id, imageId, key, coverFlag);
        setIsLoading(false);
        if (res.status === 200) {
          setObra(res.data);
          setFeedback("Imagen borrada con éxito");
        } else {
          console.log(res);
          setFeedback(errorMessages.ERROR);
        }
      } catch (e) {
        console.log(e);
        setFeedback(errorMessages.ERROR);
        setIsLoading(false);
      }
    } else if (action === "delete") {
      const id = event.target.value;
      try {
        const deleteStatus = await deleteData("obras", id);
        console.log(deleteStatus);
        if (deleteStatus.status === 200) {
          fetchObras();
          setFeedback("La obra fue borrada con éxito.");
          setSuccess(true);
          setForm("");
          setIsLoading(false);
          coverRef.current.value = "";
          imagesRef.current.value = "";
        } else {
          console.log(deleteStatus);
          setFeedback(errorMessages.ERROR);
        }
      } catch (e) {
        console.log(e);
        setFeedback(errorMessages.ERROR);
        setIsLoading(false);
        coverRef.current.value = "";
        imagesRef.current.value = "";
      }
    }
  };

  const handleClick = async event => {
    resetFields();
    setForm(event.target.id);
  };

  const handleChange = event => {
    const name = event.target.name;
    if (name === "images") {
      setImagesToUpload(event.target.files);
    } else if (name === "cover") {
      setCoverToUpload(event.target.files[0]);
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
        obras.find(item => {
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
        <Form onSubmit={handleSubmit} id="create">
          <Form.Group>
            <Form.Label htmlFor="title">Nombre corto para portada: </Form.Label>
            <Form.Control type="text" required name="title" value={title} onChange={handleChange} placeholder="Nombre corto" />
            <Form.Label htmlFor="subtitle">Nombre largo para texto interior: </Form.Label>
            <Form.Control type="text" required name="subtitle" value={subtitle} onChange={handleChange} placeholder="Nombre largo" />
            <Form.Label htmlFor="year">Año: </Form.Label>
            <Form.Control type="number" required name="year" value={year} onChange={handleChange} placeholder="Año" />
            <Form.Label htmlFor="text">Texto interior: </Form.Label>
            <Form.Control as="textarea" required name="text" value={text} onChange={handleChange} placeholder="Texto interior" />
          </Form.Group>
          <Form.Group>
            <FormFile.Label htmlFor="cover">Imagen de portada: </FormFile.Label>
            <Form.File ref={coverRef} onChange={handleChange} accept="image/*" name="cover" />
          </Form.Group>
          <Form.Group>
            <FormFile.Label htmlFor="images">Imágenes interiores: </FormFile.Label>
            <Form.File ref={imagesRef} onChange={handleChange} accept="image/*" name="images" multiple />
          </Form.Group>

          {isLoading ? <Spinner animation="grow" /> : <button type="submit">Crear nueva obra</button>}
          {feedback && <div>{feedback}</div>}
        </Form>
      )}

      {/* EDIT */}
      {form === "editForm" && (
        <Form>
          <Form.Label htmlFor="obra">Selecciona la obra</Form.Label>
          <Form.Control as="select" onChange={handleChange} name="obra" id="obra">
            <option value="">---</option>
            {obras &&
              obras.map(item => (
                <option value={item._id} key={item._id}>
                  {item.title}
                </option>
              ))}
          </Form.Control>
        </Form>
      )}
      {form === "editForm" && obra && (
        <Form onSubmit={handleSubmit} id="update">
          <Form.Group>
            <Form.Label htmlFor="title">Nombre corto para portada: </Form.Label>
            <Form.Control type="text" required name="title" value={title} onChange={handleChange} placeholder="Nombre corto" />
            <label htmlFor="subtitle">Nombre largo para texto interior: </label>
            <Form.Control type="text" required name="subtitle" value={subtitle} onChange={handleChange} placeholder="Nombre largo" />
            <label htmlFor="year">Año: </label>
            <Form.Control type="text" required name="year" value={year} onChange={handleChange} placeholder="Año" />
            <label htmlFor="text">Texto interior: </label>
            <Form.Control as="textarea" required name="text" value={text} onChange={handleChange} placeholder="Texto interior" />
          </Form.Group>
          <Form.Group>
            <p>Portada actual: </p>
            {cover ? (
              <div className="obrasForm__thumbnail-container">
                <span>{cover.originalName}</span>
                <Image className="obrasForm__thumbnail" src={`http://localhost:5000/obras/images/${cover.path}`} alt="cover" thumbnail />
                <Button className="ml-4" variant="outline-danger" onClick={handleSubmit} id="deleteCover" name={cover._id} value={cover.path}>
                  X
                </Button>
              </div>
            ) : (
              <p>No se ha seleccionado portada aún</p>
            )}
            <Form.Label htmlFor="cover">Seleccione nueva portada: </Form.Label>
            <Form.File ref={coverRef} onChange={handleChange} accept="image/*" name="cover" disabled={cover ? true : false} />
          </Form.Group>
          <Form.Group>
            <p>Imágenes interiores actuales:</p>
            {images.length ? (
              images.map(img => (
                <div className="obrasForm__thumbnail-container" key={img._id}>
                  <span>{img.originalName}</span>
                  <Image className="obrasForm__thumbnail" src={`http://localhost:5000/obras/images/${img.path}`} alt="interior" thumbnail />
                  <Button className="ml-4" variant="outline-danger" onClick={handleSubmit} id="deleteImage" name={img._id} value={img.path}>
                    X
                  </Button>
                </div>
              ))
            ) : (
              <p>No se han seleccionado imágenes interiores aún</p>
            )}
            <Form.Label htmlFor="images">Seleccione imágenes para agregar:</Form.Label>
            <Form.File ref={imagesRef} onChange={handleChange} accept="image/*" name="images" multiple />
          </Form.Group>

          {isLoading ? (
            <Spinner animation="grow" />
          ) : (
            <div>
              <Button className="mr-2" size="sm" variant="info" type="submit">
                Guardar cambios
              </Button>

              <Button variant="danger" size="sm" name="erase" id="delete" value={obra._id} onClick={handleSubmit}>
                Eliminar obra
              </Button>
            </div>
          )}
          {feedback && <div>{feedback}</div>}
        </Form>
      )}
      {success && <div>{feedback}</div>}
    </div>
  );
};

export default ObrasForm;
