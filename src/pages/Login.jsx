import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
const { VITE_APP_HOST } = import.meta.env;
import handleResState from "../utilits/handleResState";

axios.defaults.baseURL = VITE_APP_HOST;
import Swal from "sweetalert2";

//登入sign in
function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleInput(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  const login = async () => {
    console.log("sign in");
    console.log(form);
    setIsLoading(true);
    try {
      //console.log("register");
      //console.log(form);
      //console.log(`https://todolist-api.hexschool.io/users/sign_up`);
      const res = await axios.post(`/users/sign_in`, form).then((res) => {
        console.log(res.status);
        const { token } = res.data;
        //console.log(token);
        document.cookie = `token:${token}`;
        if (res.status) {
          Swal.fire({
            toast: true,
            position: "center",
            icon: "success",
            title: "Log in Success",
            showConfirmButton: false,
            timer: 1000,
          });
        }
        navigate("/todos");
        setIsLoading(false);
      });
    } catch (error) {
      handleResState("error", "登入失敗", error.res.data.message);
    }
  };

  return (
    <>
      <form className="formControls" action="index.html">
        <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
        <label className="formControls_label" htmlFor="email">
          Email
        </label>
        <input
          className="formControls_input"
          type="text"
          id="email"
          name="email"
          value={form.email}
          placeholder="請輸入 email"
          onChange={handleInput}
          required
        />
        <span>此欄位不可留空</span>
        <label className="formControls_label" htmlFor="password">
          密碼
        </label>
        <input
          className="formControls_input"
          type="password"
          name="password"
          id="pwd"
          placeholder="請輸入密碼"
          onChange={handleInput}
          required
          value={form.password}
        />
        <input
          className="formControls_btnSubmit"
          type="button"
          disabled={isLoading}
          onClick={() => {
            login();
          }}
          value="登入"
        />
        <NavLink className="formControls_btnLink" to="/register">
          註冊帳號
        </NavLink>
      </form>
    </>
  );
}

export default Login;
