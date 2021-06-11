import { useState } from "react";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { deleteImage } from "../services/services";
import { errorMessages } from "../utils/errorMessages";
import Spinner from "react-bootstrap/Spinner";

const CoverPreview = ({ img, document, setFeedback, setDocument, section }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async event => {
    setIsLoading(true);
    const key = event.target.value;
    const imageId = event.target.id;
    const coverFlag = true;
    try {
      const updatedDocument = await deleteImage(section, document._id, imageId, key, coverFlag);
      setFeedback("Imagen borrada con éxito");
      setIsLoading(false);
      setDocument(updatedDocument.data);
    } catch (e) {
      console.log(e);
      setFeedback(errorMessages.ERROR);
      setIsLoading(false);
    }
  };

  return (
    <div className="imagePreview__thumbnail-container" key={img._id}>
      <span>{img.originalName}</span>
      <Image className="imagePreview__thumbnail" src={`http://localhost:5000/${section}/images/${img.path}`} alt="interior" thumbnail />
      {isLoading ? (
        <Spinner animation="grow" />
      ) : (
        <Button className="ml-4" variant="outline-danger" onClick={handleClick} id={img._id} value={img.path}>
          x
        </Button>
      )}
    </div>
  );
};

export default CoverPreview;
