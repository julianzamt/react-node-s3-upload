const Image = ({ path }) => {
  return (
    <div key={path}>
      <img src={`http://localhost:5000/images/${path}`} alt={path} />
    </div>
  );
};

export default Image;
