import Form from "react-bootstrap/Form";
import FormFile from "react-bootstrap/FormFile";
import { useState, useRef, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { updateDocument, deleteDocument, fetchCollection } from "../services/services";
import { errorMessages } from "../utils/errorMessages";
import CoverPreview from "../components/CoverPreview";
import ImagePreview from "../components/ImagePreview";

const EditForm = ({ setFeedback, section, setFormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [collection, setCollection] = useState("");
  const [document, setDocument] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState("");
  const [imagesToUpload, setImagesToUpload] = useState("");
  const [cover, setCover] = useState("");
  const [coverToUpload, setCoverToUpload] = useState("");

  // Set references to Input Fields for reset
  const coverRef = useRef();
  const imagesRef = useRef();

  async function fetchSectionData() {
    try {
      const res = await fetchCollection(section);
      setCollection(res.data.map(item => item));
    } catch (e) {
      console.log(e);
      setFeedback(e.message);
    }
  }

  useEffect(() => {
    fetchSectionData();
  }, []);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setSubtitle(document.subtitle);
      setYear(document.year);
      setText(document.text);
      setImages(document.images);
      setCover(document.cover[0]);
    }
  }, [document]);

  const handleSubmit = async event => {
    event.preventDefault();
    const action = event.target.name;
    setFeedback("");
    setIsLoading(true);
    if (action === "updateDocument") {
      const id = document._id;
      try {
        const updatedDocument = await updateDocument({ title, subtitle, year, text, coverToUpload, imagesToUpload, section, id });
        setDocument(updatedDocument.data);
        coverRef.current.value = "";
        imagesRef.current.value = "";
        setImagesToUpload("");
        setCoverToUpload("");
        fetchSectionData();
        setFeedback("Entrada actualizada con éxito");
        setIsLoading(false);
      } catch (e) {
        console.log(e.message);
        coverRef.current.value = "";
        imagesRef.current.value = "";
        setFeedback(errorMessages.ERROR);
        setIsLoading(false);
      }
    } else if (action === "deleteDocument") {
      const id = event.target.value;
      try {
        await deleteDocument(section, id);
        coverRef.current.value = "";
        imagesRef.current.value = "";
        fetchSectionData();
        setFeedback("La obra fue borrada con éxito.");
        setIsLoading(false);
        setFormType("");
      } catch (e) {
        console.log(e);
        setFeedback(errorMessages.ERROR);
        setIsLoading(false);
        coverRef.current.value = "";
        imagesRef.current.value = "";
      }
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
    } else if (name === "obraSelect") {
      setDocument(
        collection.find(document => {
          return document["_id"] === event.target.value;
        })
      );
    }
  };

  return (
    <div>
      <Form>
        <Form.Label htmlFor="obra">Selecciona la entrada</Form.Label>
        <Form.Control as="select" onChange={handleChange} name="obraSelect">
          <option value="">---</option>
          {collection &&
            collection.map(document => (
              <option value={document._id} key={document._id}>
                {document.title}
              </option>
            ))}
        </Form.Control>
      </Form>
      {document && (
        <Form onSubmit={handleSubmit} name="updateDocument">
          <Form.Group>
            <Form.Label htmlFor="title">Nombre corto para portada: </Form.Label>
            <Form.Control type="text" required name="title" value={title} onChange={handleChange} placeholder="Nombre corto" />
            <Form.Label htmlFor="subtitle">Nombre largo para texto interior: </Form.Label>
            <Form.Control type="text" required name="subtitle" value={subtitle} onChange={handleChange} placeholder="Nombre largo" />
            <Form.Label htmlFor="year">Año: </Form.Label>
            <Form.Control type="text" required name="year" value={year} onChange={handleChange} placeholder="Año" />
            <Form.Label htmlFor="text">Texto interior: </Form.Label>
            <Form.Control as="textarea" required name="text" value={text} onChange={handleChange} placeholder="Texto interior" />
          </Form.Group>
          <Form.Group>
            <p>Portada actual: </p>
            {cover ? (
              <CoverPreview img={cover} setDocument={setDocument} setFeedback={setFeedback} document={document} section={section} />
            ) : (
              <p>No se ha seleccionado portada aún</p>
            )}
            <Form.Label htmlFor="cover">Seleccione nueva portada: </Form.Label>
            <FormFile ref={coverRef} onChange={handleChange} accept="image/*" name="cover" disabled={cover ? true : false} />
          </Form.Group>
          <Form.Group>
            <p>Imágenes interiores actuales:</p>
            {images.length ? (
              images.map(img => (
                <ImagePreview key={img._id} img={img} setDocument={setDocument} setFeedback={setFeedback} document={document} section={section} />
              ))
            ) : (
              <p>No se han seleccionado imágenes interiores aún</p>
            )}
            <Form.Label htmlFor="images">Seleccione imágenes para agregar:</Form.Label>
            <FormFile ref={imagesRef} onChange={handleChange} accept="image/*" name="images" multiple />
          </Form.Group>

          {isLoading ? (
            <Spinner animation="grow" />
          ) : (
            <div>
              <Button className="mr-2" size="sm" variant="info" type="submit">
                Guardar cambios
              </Button>
              <Button variant="danger" size="sm" name="deleteDocument" value={document._id} onClick={handleSubmit}>
                Eliminar obra
              </Button>
            </div>
          )}
        </Form>
      )}
    </div>
  );
};

export default EditForm;
