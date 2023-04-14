// import "./Modal.css";

export function Modal(props) {
  const linkStyle = {
    cursor: "pointer",
  };

  if (props.show) {
    return (
      <div className="modal-background">
        <section className="modal-main">
          {props.children}
          <button style={linkStyle} className="close" type="button" onClick={props.onClose}>
            &#x2715;
          </button>
        </section>
      </div>
    );
  }
}
