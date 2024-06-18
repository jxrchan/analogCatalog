import React from "react";
import styles from "./NavBar.module.css";
import { NavLink } from "react-router-dom";

const NavBar = (props) => {
  return (
    <header className={styles.navbar}>
      <nav>
        <ul>
          <li>
            <img src="../../images/logo.png"/>
          </li>
          <li>
            <NavLink
              to="/main"
              className={(navData) => (navData.isActive ? styles.active : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={(navData) => (navData.isActive ? styles.active : "")}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/collection"
              className={(navData) => (navData.isActive ? styles.active : "")}
            >
              Collection
            </NavLink>
          </li>
          <li>
            Welcome, {props.username}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
