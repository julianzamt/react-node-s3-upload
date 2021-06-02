const Image = ({ path }) => {
  return (
    <div>
      <img src={`http://localhost:5000/obras/images/${path}`} alt="obra" />
    </div>
  );
};

export default Image;
