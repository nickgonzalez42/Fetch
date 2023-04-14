export function Breeds(props) {
  const handleFilter = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    props.onFilter(params);
  };

  return (
    <form style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }} onSubmit={handleFilter}>
      {props.breeds?.map((breed) => (
        <div key={breed}>
          <input style={{ marginRight: "10px" }} type="checkbox" id={breed} name={breed} value={breed} />
          <label htmlFor={breed}>{breed}</label>
        </div>
      ))}
      <br />
      <button type="submit">Filter</button>
    </form>
  );
}
