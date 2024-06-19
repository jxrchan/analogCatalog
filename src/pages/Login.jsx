import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login(props) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  return (
    <div className ={styles.login}>
      <img src="../../images/App-Logo.png" alt="Analog Catalog Logo"/>
      <p> ANALOG CATALOG</p> 
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </label>
      <br />
      <button
        onClick={() => {
          props.handleLogin(username);
          navigate("/main");
        }}
      >
        LOGIN
      </button>
    </div>
  );
}

export default Login;
