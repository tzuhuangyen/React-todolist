import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import handleResState from "../utilits/handleResState";
//import Loading from "../utilits/Loading";
const { VITE_APP_HOST } = import.meta.env;

function Todos() {
  const [todos, setTodos] = useState([]);
  const [toggleState, setToggleState] = useState("全部");
  const [nickname, setNickname] = useState("");
  const newTodo = useRef();
  const navigate = useNavigate();
  //const [newTodo, setNewTodo] = useState("");

  // useEffect(() => {
  //   checkLogin();
  //   getTodos();
  // }, [toggleState]);

  const checkLogin = () => {
    useEffect(async () => {
      try {
        //取得cookiesToken
        const cookieToken = document.cookie
          .split(";")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        console.log(cookieToken);
        axios.defaults.headers.common["Authorization"] = cookieToken;

        // 驗證登入
        const res = await axios.get(`/users/checkout`).then((res) => {
          console.log(res);
          setNickname(res.data.nickname);
          getTodos();
        });
      } catch (error) {
        console.log(error);
        handleResState("error", "valid failed", error.response.data.message);
        navigate("/");
      }
    }, []);
  };
  //取得待辦事項
  const getTodos = async () => {
    try {
      const res = await axios.get(`/todos`).then((res) => {
        console.log(res.data.data);
        // if (res.status) {
        //   return res.data.data;
        // }
      });
      setTodos(res.data.data);
    } catch (error) {
      handleResState("error", "API Fetch Failued", error.response.data.message);
    }
  };

  //新增待辦事項
  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `/todos`,
        {
          content: newTodo.current.value,
        },
        {
          headers: {
            Authorization: cookieToken,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "新增待辦事項成功",
        text: "",
        showConfirmButton: true,
      });

      newTodo.current.value = "";
      getTodos();
      //頁籤轉回全部頁
      setToggleState("全部");
    } catch (error) {
      handleResState("error", "新增待辦事項失敗", error.response.data.message);
    }
  };

  return (
    <>
      {" "}
      <div id="todoListPage" className="bg-half">
        <nav>
          <h1>
            <a href="#">ONLINE TODO LIST</a>
          </h1>
          <ul>
            <li className="todo_sm">
              <a href="#">
                <span>王小明的代辦</span>
              </a>
            </li>
            <li>
              <a href="#loginPage">登出</a>
            </li>
          </ul>
        </nav>
        <div className="conatiner todoListPage vhContainer">
          <div className="todoList_Content">
            <div className="inputBox">
              <input type="text" placeholder="請輸入待辦事項" ref={newTodo} />
              <NavLink tp="#">
                <i className="fa fa-plus"></i>
              </NavLink>
            </div>
            <div className="todoList_list">
              <ul className="todoList_tab">
                <li>
                  <a href="#" className="active">
                    全部
                  </a>
                </li>
                <li>
                  <a href="#">待完成</a>
                </li>
                <li>
                  <a href="#">已完成</a>
                </li>
              </ul>
              <div className="todoList_items">
                <ul className="todoList_item">
                  <li>
                    <label className="todoList_label">
                      <input
                        className="todoList_input"
                        type="checkbox"
                        value="true"
                      />
                      <span>把冰箱發霉的檸檬拿去丟</span>
                    </label>
                    <a href="#">
                      <i className="fa fa-times"></i>
                    </a>
                  </li>
                  {/* <li>
                    <label className="todoList_label">
                      <input
                        className="todoList_input"
                        type="checkbox"
                        value="true"
                      />
                      <span>打電話叫媽媽匯款給我</span>
                    </label>
                    <a href="#">
                      <i className="fa fa-times"></i>
                    </a>
                  </li>
                  <li>
                    <label className="todoList_label">
                      <input
                        className="todoList_input"
                        type="checkbox"
                        value="true"
                      />
                      <span>整理電腦資料夾</span>
                    </label>
                    <a href="#">
                      <i className="fa fa-times"></i>
                    </a>
                  </li>
                  <li>
                    <label className="todoList_label">
                      <input
                        className="todoList_input"
                        type="checkbox"
                        value="true"
                      />
                      <span>繳電費水費瓦斯費</span>
                    </label>
                    <a href="#">
                      <i className="fa fa-times"></i>
                    </a>
                  </li>
                  <li>
                    <label className="todoList_label">
                      <input
                        className="todoList_input"
                        type="checkbox"
                        value="true"
                      />
                      <span>約vicky禮拜三泡溫泉</span>
                    </label>
                    <a href="#">
                      <i className="fa fa-times"></i>
                    </a>
                  </li>
                  <li>
                    <label className="todoList_label">
                      <input
                        className="todoList_input"
                        type="checkbox"
                        value="true"
                      />
                      <span>約ada禮拜四吃晚餐</span>
                    </label>
                    <a href="#">
                      <i className="fa fa-times"></i>
                    </a>
                  </li> */}
                </ul>
                <div className="todoList_statistics">
                  <p> 5 個已完成項目</p>
                  <a href="#">清除已完成項目</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Todos;
