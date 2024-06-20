import React from "react";
import styles from "./Collection.module.css";
import ShowUpdateModal from "./ShowUpdateModal";
import { useState, useEffect } from "react";

const Collection = (props) => {
  const [collection, setCollection] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState([]);
  const [wishlistInfo, setWishlistInfo] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [airTableId, setAirTableId] = useState(undefined);
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(undefined);
  const [notes, setNotes] = useState("");

  //Retrieving Collection from AirTable
  const getCollection = async () => {
    try {
      const res = await fetch(
        "https://api.airtable.com/v0/appEabajOfGZiNdWm/Table%201?view=Grid%20view",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("fetch error");
      }
      const data = await res.json();
      const collectionData = data.records.filter(
        (item) =>
          item.fields.username === props.username &&
          item.fields.type === "collection"
      );
      console.log(res);
      setCollection(collectionData);
      getCollectionDetails(collectionData);
    } catch (error) {
      console.log(error);
    }
  };

  //Retrieving Wishlist from AirTable
  const getWishlist = async () => {
    try {
      const res = await fetch(
        "https://api.airtable.com/v0/appEabajOfGZiNdWm/Table%201?view=Grid%20view",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("fetch error");
      }
      const data = await res.json();
      const wishlistData = data.records.filter(
        (item) =>
          item.fields.username === props.username &&
          item.fields.type === "wishlist"
      );
      console.log(res);
      getWishlistDetails(wishlistData);
    } catch (error) {
      console.log(error);
    }
  };

  //Deleting records from AirTable
  const deleteRecord = async (id) => {
    try {
      const res = await fetch(
        `https://api.airtable.com/v0/appEabajOfGZiNdWm/Table%201?records[]=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
          },
        }
      );
      console.log(res);
      getCollection();
      getWishlist();
    } catch (err) {
      console.log(err.message);
    }
  };

  //Fetching additional price information data and URL
  const getData = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_DISCOGS_API}releases/${id}`
      );
      if (!res.ok) {
        throw new Error("fetch error");
      }
      console.log(res);
      return res.json();
    } catch (err) {
      console.log(err.message);
    }
  };

  //Parse release ids from Collection into getData
  const getCollectionDetails = async (data) => {
    const tempArray = [];
    for (const item of data) {
      const details = await getData(item.fields.release_id);
      const collectionFetch = {};
      collectionFetch["purchase_price"] = item.fields.purchase_price;
      collectionFetch["notes"] = item.fields.notes;
      collectionFetch["id"] = item.id;
      collectionFetch["fields"] = details;
      tempArray.push(collectionFetch);
    }

    setCollectionInfo(tempArray);
  };

  //Parse release ids from Wishlist into getData
  const getWishlistDetails = async (data) => {
    const tempArray = [];
    for (const item of data) {
      const details = await getData(item.fields.release_id);
      const wishlistFetch = {};
      wishlistFetch["id"] = item.id;
      wishlistFetch["fields"] = details;
      tempArray.push(wishlistFetch);
    }

    setWishlistInfo(tempArray);
  };

  // const getPurchasePrice = (data) => {
  //   const record = collection.find((item) => item.id === data.id);
  //   console.log(JSON.stringify(record))
  //   return record.fields.purchase_price;
  // };

  // const getNotes = (data) => {
  //   const record = collection.find((item) => item.id === data.id);
  //   console.log(JSON.stringify(record));
  //   return record.fields.notes;
  // };

  //Loading Page
  useEffect(() => {
    getCollection();
    getWishlist();
  }, []);

  return (
    <>
      {showUpdateModal && (
        <ShowUpdateModal
          initialPurchasePrice={purchasePrice}
          initialNotes={notes}
          artist={artist}
          title={title}
          airTableId={airTableId}
          getCollection={getCollection}
          getWishlist={getWishlist}
          setShowUpdateModal={setShowUpdateModal}
        />
      )}
      <div className={styles.collection}>
        <p> My Collection </p>
        <table>
          <thead>
            <tr>
              <th style={{ width: "12%" }}> Artist </th>
              <th style={{ width: "12%" }}> Title </th>
              <th style={{ width: "8%" }}> Year </th>
              <th style={{ width: "12%" }}> Genres </th>
              <th style={{ width: "8%" }}> Resale Price (USD) </th>
              <th style={{ width: "8%" }}> Purchase Price (USD) </th>
              <th style={{ width: "16%" }}> Notes </th>
              <th style={{ width: "8%" }}> </th>
              <th style={{ width: "8%" }}> </th>
              <th style={{ width: "8%" }}> </th>
            </tr>
          </thead>
          <tbody>
            {collectionInfo.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td> {item.fields.artists[0].name} </td>
                  <td> {item.fields.title} </td>
                  <td> {item.fields.year} </td>
                  <td> {item.fields.genres.join(", ")} </td>
                  <td> {item.fields.lowest_price} </td>
                  <td>{item.purchase_price}</td>
                  <td>{item.notes}</td>
                  <td>
                    <button
                      className={styles.more}
                      onClick={() => {
                        window.open(`${item.fields.uri}`);
                      }}
                    >
                      More
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.update}
                      onClick={() => {
                        setPurchasePrice(item.purchase_price);
                        setNotes(item.notes);
                        setArtist(item.fields.artists[0].name);
                        setTitle(item.fields.title);
                        setAirTableId(item.id);
                        setShowUpdateModal(true);
                      }}
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.delete}
                      onClick={() => {
                        deleteRecord(item.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.wishlist}>
        <p> My Wishlist </p>
        <table>
          <thead>
            <tr>
              <th style={{ width: "20%" }}> Artist </th>
              <th style={{ width: "20%" }}> Record Title</th>
              <th style={{ width: "10%" }}> Year </th>
              <th style={{ width: "20%" }}> Genres </th>
              <th style={{ width: "10%" }}> Resale Price (USD)</th>
              <th style={{ width: "10%" }}></th>
              <th style={{ width: "10%" }}></th>
            </tr>
          </thead>
          <tbody>
            {wishlistInfo.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td>{item.fields.artists[0].name}</td>
                  <td>{item.fields.title}</td>
                  <td>{item.fields.year}</td>
                  <td>{item.fields.genres.join(", ")}</td>
                  <td>{item.fields.lowest_price}</td>
                  <td>
                    <button
                      className={styles.more}
                      onClick={() => {
                        window.open(`${item.fields.uri}`);
                      }}
                    >
                      More
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.delete}
                      onClick={() => {
                        deleteRecord(item.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Collection;
