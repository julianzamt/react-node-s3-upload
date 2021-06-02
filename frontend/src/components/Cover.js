import { Link } from "react-router-dom";
import "./Cover.css";

const Cover = ({ path, title, id }) => {
  return (
    <div className="cover__container">
      <div className="cover__text">{title}</div>
      <Link to={`/obras/${id}`}>
        <img
          className="cover__image"
          src={`http://localhost:5000/obras/images/${path}`}
          alt={title}
        />
      </Link>
    </div>
  );
};

export default Cover;
