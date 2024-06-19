import React from "react";
import styles from "./Collection.module.css";
import ShowUpdate from "./ShowUpdate";
import { useState, useEffect } from "react";

const Collection = (props) => {
  const [collection, setCollection] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState([]);
  const [wishlistInfo, setWishlistInfo] = useState([]);
  const [showUpdate, setShowUpdate] = useState(false);

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
      setCollection(collectionData);
      getCollectionDetails(collectionData);
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
      const wishlistData = data.records.filter(
        (item) =>
          item.fields.username === props.username &&
          item.fields.type === "wishlist"
      );
      setWishlist(wishlistData);
      getWishlistDetails(wishlistData);
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
        `${import.meta.env.VITE_DISCOGS_API}releases/${id}`
      );
      if (!res.ok) {
        throw new Error("fetch error");
      }
      return res.json();
    } catch (err) {
      console.log(err.message);
    }
  };

  //Parse release ids from Collection and Wishlist into getData
  const getCollectionDetails = async (data) => {
    const tempArray = [];
    for (const item of data) {
      const details = await getData(item.fields.release_id);
      //   const collectionFetch = {"id":item.id, "fields": details}
      const collectionFetch = {};
      collectionFetch["release_id"] = item.id;
      collectionFetch["fields"] = details;
      tempArray.push(collectionFetch);
    }

    setCollectionInfo(tempArray);
  };

  const getWishlistDetails = async (data) => {
    const tempArray = [];
    for (const item of data) {
      const details = await getData(item.fields.release_id);
      //   const wishlistFetch = {"id":item.id, "fields": details}
      const wishlistFetch = {};
      wishlistFetch["release_id"] = item.id;
      wishlistFetch["fields"] = details;
      tempArray.push(wishlistFetch);
    }

    setWishlistInfo(tempArray);
  };

  useEffect(() => {
    getCollection();
    getWishlist();
  }, []);

  return (
    <>
    {showUpdate && <showUpdate getCollection={getCollection} getWishlist={getWishlist} setShowUpdate={setShowUpdate}/>}
      <div className={styles.collection}>
        <p> Collection </p>
        <table>
          <thead>
            <tr>
              <th style={{ width: "15%" }}> Artist </th>
              <th style={{ width: "15%" }}> Title </th>
              <th style={{ width: "7%" }}> Year </th>
              <th style={{ width: "15%" }}> Genres </th>
              <th style={{ width: "7%" }}> Purchase Price (USD) </th>
              <th style={{ width: "7%" }}> Resale Price (USD) </th>
              <th style={{ width: "20%" }}> Notes </th>
              <th style={{ width: "7%" }}> </th>
              <th style={{ width: "7%" }}> </th>
              <th style={{ width: "7%" }}> </th>
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
                  <td>
                    {() => {
                      collection.filter((record) =>
                        record.fields.release_id === item.release_id
                          ? record.fields.purchase_price
                          : ""
                      );
                    }}
                  </td>
                  <td> {item.fields.lowest_price} </td>
                  <td>
                    {() => {
                      collection.filter((record) =>
                        record.fields.release_id === item.release_id
                          ? record.fields.notes
                          : ""
                      );
                    }}
                  </td>
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
                        setShowUpdate(true);
                      }}
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.delete}
                      onClick={() => {
                        deleteRecord(item.release_id);
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
        <p> Wishlist </p>
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
                  <td><button className={styles.more}
                      onClick={()=>{window.open(`${item.fields.uri}`)}}>
                      More
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.delete}
                      onClick={() => {
                        deleteRecord(item.release_id);
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
