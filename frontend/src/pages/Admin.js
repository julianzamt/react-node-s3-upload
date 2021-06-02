import { useState, useEffect } from "react";
import ObrasForm from "../components/ObrasForm";
import NosotrasForm from "../components/NosotrasForm";
import EquipamientoForm from "../components/EquipamientoForm";
import ProductoForm from "../components/ProductoForm";
import DocumentacionForm from "../components/DocumentacionForm";
import ProyectoForm from "../components/ProyectoForm";
import "./Admin.css";

const Admin = () => {
  const [section, setSection] = useState("obras");

  const handleChange = (event) => {
    setSection(event.target.value);
  };

  return (
    <div className="admin__container">
      <label htmlFor="section">Choose a section:</label>
      <select
        onChange={handleChange}
        name="section"
        id="section"
        value={section}
      >
        <option value="obras">Obras</option>
        <option value="proyectos">Proyectos</option>
        <option value="equipamiento">Equipamiento</option>
        <option value="producto">Producto</option>
        <option value="documentacion">Documentación</option>
        <option value="nosotras">Nosotras</option>
      </select>
      {section === "obras" ? <ObrasForm /> : null}
      {section === "proyectos" ? <ProyectoForm /> : null}
      {section === "equipamiento" ? <EquipamientoForm /> : null}
      {section === "producto" ? <ProductoForm /> : null}
      {section === "documentacion" ? <DocumentacionForm /> : null}
      {section === "nosotras" ? <NosotrasForm /> : null}
    </div>
  );
};

export default Admin;
