import { Link } from "react-router-dom";
import noimage from "../images/noimage.svg";
import "./Cover.css";

const Cover = ({ path, title, id }) => {
  return (
    <div className="cover__container">
      <div className="cover__text">{title}</div>
      <Link to={`/obras/${id}`}>
        {path ? (
          <img className="cover__image" src={`http://localhost:5000/obras/images/${path}`} alt={title} />
        ) : (
          <embed className="cover__image" src={noimage} alt={title} />
        )}
      </Link>
    </div>
  );
};

export default Cover;
