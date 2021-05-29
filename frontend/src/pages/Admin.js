import { useState, useEffect } from "react";
import ObrasForm from "../components/ObrasForm";

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
      </select>
      {section === "obras" ? <ObrasForm /> : null}
    </div>
  );
};

export default Admin;
