import React from "react";
import styles from "./Collection.module.css";
import ShowUpdate from "./ShowUpdate";
import { useState, useEffect } from "react";

const Collection = (props) => {
  const [collection, setCollection] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showUpdate, setShowUpdate] = useState(false);
  const [results, setResults] = useState([]);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [notes, setNotes] = useState("");

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
      setCollection(
        data.records.filter(
          (item) =>
            item.fields.username === props.username &&
            item.fields.type === "collection"
        )
      );
      console.log(collection);
    } catch (error) {
      console.log(error);
    }
  };

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
      setWishlist(
        data.records.filter(
          (item) =>
            item.fields.username === props.username &&
            item.fields.type === "wishlist"
        )
      );
      console.log(wishlist);
    } catch (error) {
      console.log(error);
    }
  };

  //Deleting records
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
        `${import.meta.env.VITE_DISCOGS_API}releases/${id}?USD`
      );
      if (!res.ok) {
        throw new Error("fetch error");
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getCollection();
    getWishlist();
  }, []);

  return (
    <>
      {JSON.stringify(collection)}
      {JSON.stringify(wishlist)}
      {showUpdate && (
        <ShowUpdate setPurchasePrice={setPurchasePrice} setNotes={setNotes} />
      )}
      <div className={styles.collection}>
        <p> Collection </p>
        <table>
          <thead>
            <tr>
              <th> Artist </th>
              <th> Title </th>
              <th> Year </th>
              <th> Genres </th>
              <th> Purchase Price </th>
              <th> Resale Price</th>
              <th> Notes </th>
              <th> </th>
              <th> </th>
              <th> </th>
            </tr>
          </thead>
          {collection.map((item) => {
            getData(item.fields.release_id);
            return (
              <tr key={item.id}>
                <td> {results.artists[0].name} </td>
                <td> {results.title} </td>
                <td> {results.year} </td>
                <td> {results.genres.join(', ')} </td>
                <td> {purchasePrice}</td>
                <td> {} </td>
                <td> {notes}</td>
                <td>
                  <button
                    onClick={() => {
                      window.open(`${results.uri}`);
                    }}
                  >
                    More Details
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setShowUpdate(true);
                    }}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
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
        </table>
      </div>
      <div className={styles.wishlist}>
        <p> Wishlist </p>
        <table>
          <thead>
            <tr>
              <th> Artist </th>
              <th> Record Title</th>
              <th> Year </th>
              <th> Genres </th>
              <th> Resale Price</th>
              <th></th>
            </tr>
          </thead>
          {wishlist.map((item) => {
            getData(item.fields.release_id);
            return (
              <tr key={item.id}>
                <td>{results.artists[0].name}</td>
                <td>{results.title}</td>
                <td>{results.year}</td>
                <td>{results.genres.join(', ')}</td>
                <td>
                  <button
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
        </table>
      </div>
    </>
  );
};

export default Collection;
