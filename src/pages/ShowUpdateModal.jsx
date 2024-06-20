import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "./ShowUpdateModal.module.css";

const OverLay = (props) => {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [notes, setNotes] = useState("");

  const updateData = async () => {
    try {
     const res = await fetch(
        "https://api.airtable.com/v0/appEabajOfGZiNdWm/Table%201",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
            "Content-Type": "application/json",
          }, body: JSON.stringify(
            {"records": [
              {
                "id": props.airTableId,
                "fields": {
                  "purchase_price": purchasePrice,
                  "notes": notes,
                }
              },
            ]

            }
          )
          
          });
          console.log(res);
      props.setShowUpdateModal(false);
      props.getCollection();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <div className={styles.backdrop}>
        <div className={styles.modal}>
          <div className={styles.header}>UPDATE YOUR PURCHASE</div>
          <div className={styles.row}>
            <div className={styles.col}>Artist</div>
            <div className={styles.col}>{props.artist}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>Record Title</div>
            <div className={styles.col}>{props.title}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>Purchase Price (USD)</div>
            <input
              type="text"
              className={styles.col}
              placeholder = {props.initialPurchasePrice}
              value={purchasePrice}
              onChange={(event) => {
                setPurchasePrice(event.target.value);
              }}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.col}>Notes</div>
            <input
              type="text"
              className={styles.col}
              placeholder = {props.initialNotes}
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
              }}
            />
          </div>
          <div className={styles.row}>
            <button
              className={`${styles.col} ${styles.update}`}
              onClick={updateData}
            >
              Update
            </button>
            <button
              className={`${styles.col} ${styles.cancel}`}
              onClick={() => props.setShowUpdateModal(false)}
            >
              Cancel
            </button>
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
          initialPurchasePrice = {props.initialPurchasePrice}
          initialNotes = {props.initialNotes}
          title={props.title}
          artist={props.artist}
          airTableId={props.airTableId}
          getCollection={props.getCollection}
          setShowUpdateModal={props.setShowUpdateModal}
        />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default UpdateModal;
