import Form from "react-bootstrap/Form";
import FormFile from "react-bootstrap/FormFile";
import { useState, useRef } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { postDocument } from "../services/services";
import { errorMessages } from "../utils/errorMessages";

const DocumentacionCreateForm = ({ section, setFeedback, fetchSectionData, setFormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [imagesToUpload, setImagesToUpload] = useState("");
  const [textError, setTextError] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const TEXT_LIMIT = 300;

  // Set references to Input Fields for reset
  const imagesRef = useRef();

  const handleSubmit = async event => {
    event.preventDefault();
    setFeedback("");
    setIsLoading(true);
    try {
      await postDocument({ text, imagesToUpload, section });
      imagesRef.current.value = "";
      setFeedback("Entrada creada con éxito");
      setIsLoading(false);
      setFormType("");
    } catch (e) {
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
    } else if (name === "text") {
      setText(event.target.value);
      if (event.target.value.length >= TEXT_LIMIT) {
        setTextError(true);
        setDisableButton(true);
      } else if (event.target.value.length < TEXT_LIMIT) {
        setTextError(false);
        setDisableButton(false);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label htmlFor="text">Texto interior: </Form.Label>
        <Form.Control as="textarea" required name="text" value={text} onChange={handleChange} placeholder="Texto interior" maxLength={TEXT_LIMIT} />
        {textError && <Form.Text style={{ color: "red" }}>{`El texto principal no puede superar los ${TEXT_LIMIT} caracteres.`}</Form.Text>}
      </Form.Group>
      <Form.Group>
        <FormFile.Label htmlFor="images">Imágenes interiores: </FormFile.Label>
        <Form.File ref={imagesRef} onChange={handleChange} accept="image/*" name="images" multiple />
      </Form.Group>

      {isLoading ? (
        <Spinner animation="grow" />
      ) : (
        <Button type="submit" disabled={disableButton}>
          Crear entrada
        </Button>
      )}
    </Form>
  );
};

export default DocumentacionCreateForm;
