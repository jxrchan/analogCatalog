import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login(props) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  return (
    <div className ={styles.login}>
      <h2>Login Page</h2>
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
      <br />
      <button
        onClick={() => {
          props.handleLogin(username);
          navigate("/main");
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
