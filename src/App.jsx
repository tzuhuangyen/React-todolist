import { useState } from "react";
import { Route, Routes, NavLink } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Todo from "./pages/Todo";
import "./App.css";

function App() {
  //const [count, setCount] = useState(0);

  return (
    <>
      {/* <!-- login_page --> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>

      {/*<!-- sign up /Register -->*/}

      {/* <!-- ToDo List --> */}
    </>
  );
}

export default App;
