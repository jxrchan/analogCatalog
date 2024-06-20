import React, { useEffect, useState } from "react";
import styles from "./Main.module.css";

const Main = (props) => {
  const formats = [
    '7"',
    '10"',
    '12"',
    "LP",
    "EP",
    "Single",
    "Box Set",
    "33 ⅓ RPM",
    "45 RPM",
    "78 RPM",
  ];

  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState("");
  const [checked, setChecked] = useState(new Array(formats.length).fill(false));
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  const handleCheck = (position) => {
    const updateChecked = checked.map((item, idx) =>
      idx === position ? !item : item
    );
    setChecked(updateChecked);
  };

  const handleSearch = () => {
    const selectedFormats = formats.filter((_, idx) => checked[idx]);
    setFormat(selectedFormats.join("&format=").replaceAll(" ", "+"));
    setPage(1);
    getSearch();
  };

  //Fetch Search Results from Discogs
  const getSearch = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_DISCOGS_API
        }database/search?artist=${artist.replaceAll(
          " ",
          "+"
        )}&title=${title.replaceAll(
          " ",
          "+"
        )}&format=Vinyl&format=${format}&page=${page}&per_page=12&key=${
          import.meta.env.VITE_CONSUMER_KEY
        }&secret=${import.meta.env.VITE_CONSUMER_SECRET}`
      );
      if (!res.ok) {
        throw new Error("fetch error");
      }
      console.log(res);
      const data = await res.json();
      setResults(data.results);
      setLastPage(data.pagination.pages);
    } catch (err) {
      console.log(err.message);
    }
  };

  //Store Collection data into AirTable
  const storeCollection = async (id) => {
    try {
      const res = await fetch(
        `https://api.airtable.com/v0/appEabajOfGZiNdWm/Table%201`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
          },
          body: JSON.stringify({
            records: [
              {
                fields: {
                  username: props.username,
                  type: "collection",
                  release_id: id.toString(),
                },
              },
            ],
          }),
        }
      );
      console.log(res);
      if (!res.ok) {
        throw new Error("error posting data");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  //Store Wishlist data into AirTable

  const storeWishlist = async (id) => {
    try {
      const res = await fetch(
        `https://api.airtable.com/v0/appEabajOfGZiNdWm/Table%201`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
          },
          body: JSON.stringify({
            records: [
              {
                fields: {
                  username: props.username,
                  type: "wishlist",
                  release_id: id.toString(),
                },
              },
            ],
          }),
        }
      );
      console.log(res)
      if (!res.ok) {
        throw new Error("error posting data");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <div className={styles.form}>
        <label>
           ARTIST 
        </label>
        <input
          type="text"
          value={artist}
          onChange={(e) => {
            setArtist(e.target.value);
          }}
        ></input>
        <label>
        RECORD TITLE 
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        ></input>
        <label>
          FORMATS
        </label>
        <div className={styles["checkboxes"]}>
          {formats.map((item, idx) => {
            return (
              <div key={item}>
                <label> {item} </label>
                <input
                  type="checkbox"
                  name={item}
                  value={item}
                  checked={checked[idx]}
                  onChange={() => handleCheck(idx)}
                />
                <label> </label>
              </div>
            );
          })}
        </div>
        <button onClick={() => handleSearch()}>SEARCH</button>
      </div>
      {results.length !== 0 && (
        <div className={styles.results}>
          {results.map((item, idx) => {
            return (
              <>
                <div key={`results-${idx}`} className={styles.resultItem}>
                  <img
                    src={item.cover_image}
                    className={styles.coverImage}
                  ></img>
                  <div className={styles.buttons}>
                    <button
                      className={styles.button}
                      onClick={() => storeCollection(item.id)}
                    >
                      Add to Collection
                    </button>
                    <button
                      className={styles.button}
                      onClick={() => storeWishlist(item.id)}
                    >
                      Add to Wishlist
                    </button>
                  </div>
                  {item.title} <br /> <br />
                  {item.format.join(", ")} <br /> <br />
                  <em> Released: {item.year} </em> <br />
                </div>
              </>
            );
          })}
        </div>
      )}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        {page !== 1 && (
          <a
            className={styles.link}
            onClick={() => {
              setPage((prevState) => prevState - 1);
              getSearch();
            }}
          >
            Previous
          </a>
        )}
        {results.length > 0 && page !== lastPage && (
          <a
            className={styles.link}
            onClick={() => {
              setPage((prevState) => prevState + 1);
              getSearch();
            }}
          >
            Next
          </a>
        )}
      </div>
    </>
  );
};

export default Main;
