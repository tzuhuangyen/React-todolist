import { Route, Routes, NavLink } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Todos from "./pages/Todos";
import "./App.css";
import Auth from "./pages/Auth";

function App() {
  return (
    <>
      {/* <!-- login_page --> */}
      <Routes>
        {/* {共用版型} */}
        <Route path="/" element={<Auth />}>
          {/* {共用版型/Login} */}
          <Route index element={<Login />} />
          {/* {共用版型/Register} */}
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/todos" element={<Todos />} />
      </Routes>
    </>
  );
}

export default App;
