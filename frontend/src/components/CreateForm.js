import Form from "react-bootstrap/Form";
import FormFile from "react-bootstrap/FormFile";
import { useState, useRef } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { postDocument } from "../services/services";
import { errorMessages } from "../utils/errorMessages";

const CreateForm = ({ section, setFeedback, fetchSectionData, setFormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  const [coverToUpload, setCoverToUpload] = useState("");
  const [imagesToUpload, setImagesToUpload] = useState("");

  // Set references to Input Fields for reset
  const coverRef = useRef();
  const imagesRef = useRef();

  const handleSubmit = async event => {
    event.preventDefault();
    setFeedback("");
    setIsLoading(true);
    try {
      await postDocument({ title, subtitle, year, text, coverToUpload, imagesToUpload, section });
      coverRef.current.value = "";
      imagesRef.current.value = "";
      setFeedback("Entrada creada con éxito");
      setIsLoading(false);
      setFormType("");
    } catch (e) {
      coverRef.current.value = "";
      imagesRef.current.value = "";
      console.log(e);
      setFeedback(errorMessages.ERROR);
      setIsLoading(false);
    }
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
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
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

      {isLoading ? <Spinner animation="grow" /> : <Button type="submit">Crear entrada</Button>}
    </Form>
  );
};

export default CreateForm;
