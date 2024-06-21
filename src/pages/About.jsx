
import React from "react";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.about}>
      <p className={styles.credits}>Powered by</p>
      <img src='../../images/Discogs_logo_black.svg' alt="Discogs logo" />
      
      <p>
        <span style={{fontFamily: "Rajdhani", textTransform: "uppercase", fontSize: "30px"}}> Analog Catalog </span> is targeted at record enthusiasts
        looking to catalogue and value their vinyl collections. The application
        was designed in React.js and completed as a professional course project.
        It uses the open-source Discogs© webAPI, fetching data from Discog's
        database and marketplace to present consolidated information about your
        records.
      </p> 

      <p>
        Search records at the <em>Home</em> page using artist name, record title, and format. Add records of interest to your collection or wishlist.
        Next, navigate to the <em>Collections</em> page. Choose to provide purchase information for your collected records and compare them to marketplace data.
      </p>
    </div>
  );
};

export default About;