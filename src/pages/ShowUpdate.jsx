import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

const OverLay = (props) => {
  const [purchase_price, setPurchasePrice] = useState(0);
  const [notes, setNotes] = useState("");

  const updateData = async () => {
    const res = await fetch(
      import.meta.env.VITE_SERVER + "/lesson/books/" + props.id,
      {
        method: "PATCH",
        //telling your backend that it is passing in JSON
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({title, author, year}),
      }
    );
    if (!res.ok) {
      throw new Error("update error");
    }

    props.getData();
    props.setShowUpdateModal(false);
  };

  return (
    <>
      <div className={styles.backdrop}>
        <div className={styles.modal}>
          <br />
          <br />
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-3">Title</div>
            <input
              type="text"
              className="col-md-3"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <div className="col-md-3"></div>
          </div>

          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-3">Author</div>
            <input
              type="text"
              className="col-md-3"
              value={author}
              onChange={(event) => {
                setAuthor(event.target.value);
              }}
            />
            <div className="col-md-3"></div>
          </div>

          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-3">Year Published</div>
            <input
              type="text"
              className="col-md-3"
              value={year}
              onChange={(event) => {
                setYear(event.target.value);
              }}
            />
            <div className="col-md-3"></div>
          </div>
          <div className="row">
            <div className="col-md-3"></div>
            <button className="col-md-3" onClick={updateBook}>
              update
            </button>
            <button
              className="col-md-3"
              onClick={() => props.setShowUpdateModal(false)}
            >
              {" "}
              Cancel
            </button>
            <div className="col-md-3"></div>
          </div>
        </div>
      </div>
    </>
  );
};

const UpdateModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          id={props.id}
          title={props.title}
          author={props.author}
          year={props.year}
          getData={props.getData}
          setShowUpdateModal={props.setShowUpdateModal}
        />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default UpdateModal;
