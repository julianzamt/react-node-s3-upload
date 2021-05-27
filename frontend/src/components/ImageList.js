const ImageList = ({ originalName, path }) => {
  return (
    <div>
      <div className="imageList__container">{originalName}</div>
      <img src={`http://localhost:5000/images/${path}`} alt="obra" />
    </div>
  );
};

export default ImageList;
