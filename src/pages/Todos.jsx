import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import handleResState from "../utilits/handleResState";
import List from "./List";
//import Loading from "../utilits/Loading";

const { VITE_APP_HOST } = import.meta.env;
//console.log(VITE_APP_HOST);
const cookieToken = document.cookie
  .split(";")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];
axios.defaults.headers.common["Authorization"] = cookieToken;

function Todos() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");

  const [nickname, setNickname] = useState("");
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ content: "" });
  const [message, setMessage] = useState("");
  const [editContent, setEditContent] = useState("");
  //驗證登入token並取得暱稱
  console.log("Authorization Token:", cookieToken);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${VITE_APP_HOST}/users/checkout `, {
          headers: {
            Authorization: cookieToken,
          },
        });
        console.log(res.data.nickname);
        setNickname(res.data.nickname);
        getTodos();
      } catch (error) {
        console.error("Error fetching user data:", error);
        handleResState("error", "API Fetch Failed", error.message);
        navigate("/");
      }
    })();
  }, []);

  //取得待辦事項
  const getTodos = async () => {
    try {
      const res = await axios.get(`/todos/`);
      console.log("Updated todos:", res);
      setTodos(res.data.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      handleResState("error", "API Fetch Failued", error.response.data.message);
    }
  };

  //登出log out
  const logout = async () => {
    try {
      const res = await axios.post(`${VITE_APP_HOST}/users/sign_out`, {});
      document.cookie = "token=;";
      Swal.fire({
        title: "Log out?",
        showDenyButton: true,
        confirmButtonText: "Sure!",
        denyButtonText: "Cancel",
      }).then((res) => {
        if (res.isConfirmed) {
          Swal.fire({
            title: "Logged out",
            showConfirmButton: false,
            timer: 500,
          });
          navigate("/");
        }
      });
    } catch (error) {}
    if (res.isDenied) {
      return;
    }
  };
  //新增待辦事項
  const addTodo = async () => {
    if (!newTodo) return;
    try {
      const res = await axios.post(
        `${VITE_APP_HOST}/todos`,
        {
          content: newTodo.content,
        },
        {
          headers: {
            "Content-Type": "application/json",

            Authorization: cookieToken,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Todo added",
        text: "",
        showConfirmButton: false,
        timer: 1500,
      });
      getTodos();
      setNewTodo({ content: "" });
    } catch (error) {
      console.error("Error adding todo:", error);
      handleResState(
        "error",
        "Failed to add todo",
        error.response?.data?.message || "Unknown error occurred"
      );
    }
  };

  //click "enter" to submit
  const keyDownToCreate = (e) => {
    if (e.key === "Enter") {
      newTodo.content ? addTodo() : setMessage("欄位不可空白");
    }
  };
  console.log("todos length:", todos.length);

  //todos render
  return (
    //渲染 nav input + List(todolist )
    <div>
      <div id="todoListPage" className="bg-half">
        <nav>
          <h1>
            <a href="#">ONLINE TODO LIST</a>
          </h1>
          <ul>
            <li className="todo_sm">
              <span>{nickname}的代辦</span>
            </li>
            <li>
              <button className="logoutButton " onClick={logout}>
                Log out
              </button>
            </li>
          </ul>
        </nav>
        <div className="conatiner todoListPage vhContainer">
          <div className="todoList_Content">
            {/* {輸入框} */}
            <div className="inputBox">
              <input
                type="text"
                placeholder="Enter todo"
                value={newTodo.content}
                onChange={(e) => {
                  setMessage("");
                  setNewTodo({ content: e.target.value });
                }}
                onKeyDown={keyDownToCreate}
              />
              <button
                className="formControls_btnLink"
                onClick={() => {
                  newTodo.content
                    ? addTodo()
                    : setMessage("please enter to do list");
                }}
              >
                <i className="fa fa-plus"></i>
              </button>
            </div>
            {todos.length ? (
              <List
                todos={todos}
                setTodos={setTodos}
                getTodos={getTodos}
                editContent={editContent}
                setEditContent={setEditContent}
              />
            ) : (
              <p>沒有待辦事項</p>
            )}
          </div>
        </div>
      </div>
    </div>
  ); //Todos retrun的）
  //Todos最外層的}了
}

export default Todos;
