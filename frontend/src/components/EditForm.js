import Form from "react-bootstrap/Form";
import FormFile from "react-bootstrap/FormFile";
import { useState, useRef, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { deleteDocument, fetchCollection, updateCover, updateText, updateImages, updateOrder } from "../services/services";
import { errorMessages } from "../utils/errorMessages";
import CoverPreview from "../components/CoverPreview";
import ImagePreview from "../components/ImagePreview";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Modal from "react-bootstrap/Modal";
import "./EditForm.css";

const EditForm = ({ setFeedback, section, setFormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [collection, setCollection] = useState("");
  const [document, setDocument] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  const [disablePostText, setDisablePostText] = useState(true);
  const [images, setImages] = useState("");
  const [imagesToUpload, setImagesToUpload] = useState("");
  const [cover, setCover] = useState("");
  const [coverToUpload, setCoverToUpload] = useState("");
  const [disableNewOrderButton, setDisableNewOrderButton] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
      setDisablePostText(true);
      setDisableNewOrderButton(true);
    }
  }, [document]);

  const handleSubmit = async event => {
    event.preventDefault();
    const action = event.target.name;
    setFeedback("");
    setIsLoading(true);
    if (action === "updateCover") {
      const documentId = document._id;
      try {
        const updatedDocument = await updateCover({ coverToUpload, section, documentId });
        setDocument(updatedDocument.data);
        coverRef.current.value = "";
        setCoverToUpload("");
        fetchSectionData();
        setFeedback("Portada actualizada con éxito");
        setIsLoading(false);
      } catch (e) {
        console.log(e.message);
        coverRef.current.value = "";
        setFeedback(errorMessages.ERROR);
        setIsLoading(false);
      }
    } else if (action === "updateText") {
      const documentId = document._id;
      try {
        const updatedDocument = await updateText({ title, subtitle, year, text, section, documentId });
        setDocument(updatedDocument.data);
        fetchSectionData();
        setFeedback("Texto actualizado con éxito");
        setIsLoading(false);
      } catch (e) {
        console.log(e.message);
        setFeedback(errorMessages.ERROR);
        setIsLoading(false);
      }
    } else if (action === "updateImages") {
      const documentId = document._id;
      try {
        const updatedDocument = await updateImages({ imagesToUpload, section, documentId });
        setDocument(updatedDocument.data);
        imagesRef.current.value = "";
        setImagesToUpload("");
        fetchSectionData();
        setFeedback("Imágenes actualizadas con éxito");
        setIsLoading(false);
      } catch (e) {
        console.log(e.message);
        imagesRef.current.value = "";
        setFeedback(errorMessages.ERROR);
        setIsLoading(false);
      }
    } else if (action === "updateOrder") {
      const documentId = document._id;
      try {
        const updatedDocument = await updateOrder({ images, section, documentId });
        setDocument(updatedDocument.data);
        fetchSectionData();
        setFeedback("Orden guardado con éxito");
        setIsLoading(false);
      } catch (e) {
        console.log(e.message);
        setFeedback(errorMessages.ERROR);
        setIsLoading(false);
      }
    } else if (action === "deleteDocument") {
      const documentId = document._id;
      try {
        await deleteDocument({ section, documentId });
        setFeedback("La obra fue borrada con éxito.");
        setIsLoading(false);
        setFormType("");
      } catch (e) {
        console.log(e);
        setFeedback(errorMessages.ERROR);
        setIsLoading(false);
      }
    }
  };

  const handleOnDragEnd = result => {
    if (!result.destination) return;
    setDisableNewOrderButton(false);
    let items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setImages(items);
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
    if (name === "title" || name === "subtitle" || name === "year" || name === "text") {
      setDisablePostText(false);
    }
  };

  const handleShow = () => {
    setShowConfirmation(true);
  };

  const handleClose = () => {
    setShowConfirmation(false);
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
        <div>
          <Form onSubmit={handleSubmit} name="updateText">
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
            {isLoading ? (
              <Spinner animation="grow" />
            ) : (
              <Button size="sm" variant="info" type="submit" disabled={disablePostText}>
                Guardar edición de texto
              </Button>
            )}
          </Form>

          <Form onSubmit={handleSubmit} name="updateCover">
            <Form.Group>
              <p>Portada actual (eliminarla primero para poder elegir una nueva): </p>
              {cover ? (
                <CoverPreview img={cover} setDocument={setDocument} setFeedback={setFeedback} document={document} section={section} />
              ) : (
                <p>No se ha seleccionado portada aún</p>
              )}
              <Form.Label htmlFor="cover">Seleccione nueva portada: </Form.Label>
              <FormFile ref={coverRef} onChange={handleChange} accept="image/*" name="cover" disabled={cover ? true : false} />

              {isLoading ? (
                <Spinner animation="grow" />
              ) : (
                <Button size="sm" variant="info" type="submit" disabled={coverToUpload ? false : true}>
                  Guardar Nueva Portada
                </Button>
              )}
            </Form.Group>
          </Form>

          <Form onSubmit={handleSubmit} name="updateOrder">
            <Form.Group>
              <p>Imágenes interiores (Arrastrar y soltar para cambiar el orden):</p>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="imagesPreview">
                  {provided => (
                    <ul {...provided.droppableProps} ref={provided.innerRef} className="editForm__droppable">
                      {images.length ? (
                        images.map((img, index) => (
                          <Draggable key={img._id} draggableId={img._id} index={index}>
                            {provided => (
                              <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                <ImagePreview img={img} setDocument={setDocument} setFeedback={setFeedback} document={document} section={section} />
                              </li>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p>No se han seleccionado imágenes interiores aún</p>
                      )}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
              {isLoading ? (
                <Spinner animation="grow" />
              ) : (
                <Button size="sm" variant="info" type="submit" disabled={disableNewOrderButton}>
                  Guardar Nuevo Orden
                </Button>
              )}
            </Form.Group>
          </Form>

          <Form onSubmit={handleSubmit} name="updateImages">
            <Form.Group>
              <Form.Label htmlFor="images">Seleccione Imágenes (Se agregarán al final del orden actual):</Form.Label>
              <FormFile ref={imagesRef} onChange={handleChange} accept="image/*" name="images" multiple />

              {isLoading ? (
                <Spinner animation="grow" />
              ) : (
                <Button size="sm" variant="info" type="submit" disabled={imagesToUpload ? false : true}>
                  Guardar Nuevas Imágenes
                </Button>
              )}
            </Form.Group>
          </Form>

          <Form>
            {isLoading ? (
              <Spinner animation="grow" />
            ) : (
              <div>
                <Button className="mt-2" variant="danger" size="sm" onClick={handleShow}>
                  Eliminar entrada
                </Button>
              </div>
            )}
            <Modal show={showConfirmation} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>¡Cuidado!</Modal.Title>
              </Modal.Header>
              <Modal.Body>La entrada se eliminará definitivamente.</Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleSubmit} name="deleteDocument">
                  Eliminar definitivamente
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Volver
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>
        </div>
      )}
    </div>
  );
};

export default EditForm;
