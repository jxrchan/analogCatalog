import React, { Suspense, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";

const Main = React.lazy(() => import("./pages/Main"));
const About = React.lazy(() => import("./pages/About"));
const Collection = React.lazy(() => import("./pages/Collection"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Login = React.lazy(() => import("./pages/Login"));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setUsername(username);
    setIsLoggedIn(true);
  }
  
  return (
    <>
      {isLoggedIn && <NavBar username={username}/>}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/login"
              element={<Login handleLogin={handleLogin} />}
            />
            <Route
              path="/"
              element={
                <Navigate replace to={isLoggedIn ? "/main" : "/login"} />
              }
            />
            <Route
              path="/main"
              element={isLoggedIn ? <Main /> : <Navigate replace to="/login" />}
            />
            <Route
              path="/about"
              element={
                isLoggedIn ? <About /> : <Navigate replace to="/login" />
              }
            />
            <Route
              path="/collection"
              element={
                isLoggedIn ? <Collection /> : <Navigate replace to="/login" />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
    </>
  );
}

export default App;
