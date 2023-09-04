import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../utilits/handleResState";
import handleResState from "../utilits/handleResState";
import Swal from "sweetalert2";
const { VITE_APP_HOST } = import.meta.env;
axios.defaults.baseURL = VITE_APP_HOST;

//註冊sign up
function Register() {
  console.log(VITE_APP_HOST);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: [],
    passwordCheck: "",
    //確認user數入的密碼是否相同 並不用送到serve
  });

  function handleInput(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  const register = async () => {
    try {
      //console.log("register");
      console.log(form);
      //console.log(`https://todolist-api.hexschool.io/users/sign_up`);
      const { passwordCheck, ...dataToSend } = form;
      //這樣做的目的是為了將表單資料傳送到伺服器進行註冊，但不包含確認密碼。
      //因為確認密碼不需要傳送到伺服器，只是用來在前端進行密碼驗證。
      //所以在這裡， dataToSend  是一個不包含passwordCheck的註冊資料並傳送到伺服器。
      if (form.password !== passwordCheck) {
        handleResState("error", "Sign up Failed", "password are different");
        return;
      }
      const res = await axios.post(`/users/sign_up`, dataToSend).then((res) => {
        console.log(res.status);
        if (res.status) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Sign up Success",
            showConfirmButton: false,
            timer: 1000,
          });
        }
        navigate("/auth/login");
      });
    } catch (error) {
      handleResState("error", "註冊失敗", error.res.data.message);
    }
  };

  return (
    <>
      <div id="signUpPage" className="bg-yellow">
        <div className="conatiner signUpPage vhContainer">
          <div className="side">
            <a href="#">
              <img
                className="logoImg"
                src="https://upload.cc/i1/2022/03/23/rhefZ3.png"
                alt=""
              />
            </a>
            <img
              className="d-m-n"
              src="https://upload.cc/i1/2022/03/23/tj3Bdk.png"
              alt="workImg"
            />
          </div>
          <div>
            <div id="loginPage" className="bg-yellow">
              <div className="conatiner loginPage vhContainer ">
                <div className="side">
                  <a href="#">
                    <img
                      className="logoImg"
                      src="https://upload.cc/i1/2022/03/23/rhefZ3.png"
                      alt=""
                    />
                  </a>
                  <img
                    className="d-m-n"
                    src="https://upload.cc/i1/2022/03/23/tj3Bdk.png"
                    alt="workImg"
                  />
                </div>
                <div>
                  <form className="formControls" action="index.html">
                    <h2 className="formControls_txt">註冊帳號</h2>
                    <label className="formControls_label" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="formControls_input"
                      type="text"
                      //   id="email"
                      name="email"
                      placeholder="請輸入 email"
                      required
                      onChange={handleInput}
                      value={form.email}
                    />
                    <label className="formControls_label" htmlFor="nickname">
                      您的暱稱
                    </label>
                    <input
                      className="formControls_input"
                      type="text"
                      name="nickname"
                      //   id="name"
                      placeholder="請輸入您的暱稱"
                      value={form.nickname}
                      onChange={handleInput}
                    />
                    <label className="formControls_label" htmlFor="password">
                      密碼
                    </label>
                    <input
                      className="formControls_input"
                      type="password"
                      name="password"
                      //   id="pwd"
                      placeholder="請輸入密碼"
                      required
                      onChange={handleInput}
                      value={form.password}
                    />
                    <label
                      className="formControls_label"
                      htmlFor="passwordCheck"
                    >
                      再次輸入密碼
                    </label>
                    <input
                      className="formControls_input"
                      type="password"
                      name="passwordCheck"
                      //   id="pwd"
                      placeholder="請再次輸入密碼"
                      required
                      onChange={handleInput}
                      value={form.passwordCheck}
                    />
                    <input
                      className="formControls_btnSubmit"
                      type="button"
                      onClick={register}
                      value="註冊帳號"
                    />
                    <NavLink
                      className="nav-link fw-bold text-dark btn btn-outline-secondary mt-3"
                      to="/"
                    >
                      {" "}
                      登入
                    </NavLink>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Register;
