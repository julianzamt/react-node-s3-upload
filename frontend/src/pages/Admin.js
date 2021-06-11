import { useState } from "react";
import Form from "react-bootstrap/Form";
import CreateForm from "../components/CreateForm";
import EditForm from "../components/EditForm";
import Button from "react-bootstrap/Button";
import "./Admin.css";
const Admin = () => {
  const [formType, setFormType] = useState("");
  const [feedback, setFeedback] = useState(false);
  const [section, setSection] = useState("");

  const handleClick = event => {
    setFeedback("");
    setFormType(event.target.id);
  };

  const handleChange = event => {
    setSection(event.target.value);
    setFormType("");
    setFeedback("");
  };

  return (
    <div className="admin__container">
      <Form>
        <Form.Label htmlFor="section">Elegí una sección:</Form.Label>
        <Form.Control as="select" onChange={handleChange} name="section" id="section" value={section}>
          <option value="">---</option>
          <option value="obras">Obras</option>
          <option value="proyectos">Proyectos</option>
          <option value="equipamiento">Equipamiento</option>
          <option value="producto">Producto</option>
          <option value="documentacion">Documentación</option>
          <option value="nosotras">Nosotras</option>
        </Form.Control>
      </Form>
      {section && (
        <div>
          <h1 style={{ textTransform: "capitalize", textAlign: "center", margin: "0.5em" }}>{section}</h1>
          <div className="admin__button-container">
            <Button id="createForm" onClick={handleClick}>
              Crear nueva entrada
            </Button>
            <Button id="editForm" onClick={handleClick}>
              Editar entrada
            </Button>
          </div>
        </div>
      )}
      {formType === "createForm" && <CreateForm section={section} setFeedback={setFeedback} setFormType={setFormType} />}
      {formType === "editForm" && <EditForm setFeedback={setFeedback} section={section} setFormType={setFormType} />}
      {<div>{feedback}</div>}
    </div>
  );
};

export default Admin;
