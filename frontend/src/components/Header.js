import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header__container">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Caza</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to={"/"}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to={"/admin"}>
              Admin
            </Nav.Link>
            <Nav.Link as={Link} to={"/obras"}>
              Obras
            </Nav.Link>
            <Nav.Link as={Link} to={"/proyectos"}>
              Proyectos
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
