import axios from "axios";
import { useState } from "react";

const { VITE_APP_HOST } = import.meta.env;
axios.defaults.baseURL = VITE_APP_HOST;

//登入sign in
function Login() {
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
    try {
      //console.log("register");
      //console.log(form);
      //console.log(`https://todolist-api.hexschool.io/users/sign_up`);
      const res = await axios.post(`/users/sign_in`, form).then((res) => {
        console.log(res);
      });
    } catch (error) {
      console.log(error.response.data.message);
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
          onClick={() => {
            login();
          }}
          value="登入"
        />
        <a className="formControls_btnLink" href="#signUpPage">
          註冊帳號
        </a>
      </form>{" "}
    </>
  );
}

export default Login;
