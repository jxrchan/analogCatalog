import React, { useEffect, useState } from "react";
import styles from "./Main.module.css";

const Main = () => {
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
      const data = await res.json();
      setResults(data.results);
      setLastPage(data.pagination.pages);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className={styles.form}>
        <label> ARTIST </label>
        <input
          type="text"
          value={artist}
          onChange={(e) => {
            setArtist(e.target.value);
          }}
        ></input>
        <label> RECORD TITLE </label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        ></input>
        <label> FORMATS </label>
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
      <div className={styles.results}>
        {results.map((item, idx) => {
          return (
            <>
              <div key={`results-${idx}`} className={styles.resultItem}>
                <img src={item.cover_image} className={styles.coverImage}></img>
                <div className={styles.buttons}>
                  <button
                    className={styles.button}
                    onClick={() => addToWishlist(item.id)}
                  >
                    Add to Wishlist
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => addToCollection(item.id)}
                  >
                    Add to Collection
                  </button>
                </div>
                {item.artist} <br />
                {item.title} <br />
                {item.genre.toString()} <br />
                {item.year} <br />
              </div>
            </>
          );
        })}
        <div>
          {page !== 1 && (
            <button
              onClick={() => {
                setPage((prevState) => prevState - 1);
                getSearch();
              }}
            >
              Previous
            </button>
          )}
          {results.length > 0 && page !== lastPage && (
            <button
              onClick={() => {
                setPage((prevState) => prevState + 1);
                getSearch();
              }}
            >
              Next
            </button>
          )}{" "}
        </div>
        {artist} <br />
        {title} <br />
        {JSON.stringify(checked)} <br />
        {format} <br />
        {JSON.stringify(results)}
      </div>
    </>
  );
};

export default Main;
