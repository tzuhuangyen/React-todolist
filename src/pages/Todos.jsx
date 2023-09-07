import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import handleResState from "../utilits/handleResState";
//import Loading from "../utilits/Loading";
const { VITE_APP_HOST } = import.meta.env;
console.log(VITE_APP_HOST);
function Todos() {
  const [todos, setTodos] = useState([]);
  //const [toggleState, setToggleState] = useState("全部");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const [newTodo, setNewTodo] = useState("");
  const [showTodo, setShowTodos] = useState([]);
  const [filter, setFilter] = useState("");
  //axios.defaults.headers.common["Authorization"] = `Bearer ${cookieToken}`;
  const cookieToken = document.cookie
    .split(";")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  console.log(cookieToken);

  // useEffect(() => {
  //   getTodos();
  // }, []);

  //驗證登入token並取得暱稱
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${VITE_APP_HOST}/users/checkout `, {
          headers: {
            Authorization: cookieToken,
          },
        });
        console.log(res);
        setNickname(res.data.nickname);
        getTodos();
      } catch (error) {
        console.error("Error fetching user data:", error);
        handleResState("error", "API Fetch Failed", error.message);
        navigate("/");
      }
    })();
  }, []);

  //篩選待辦事項
  useEffect(() => {
    if (filter == "all") {
      setShowTodos(todos);
    } else if (filter == "done") {
      setShowTodos(todos.filter((item) => item.status == true));
    } else {
      setShowTodos(todos.filter((item) => item.status == false));
    }
  }, [filter, todos]);

  //取得待辦事項
  const getTodos = async () => {
    try {
      if (!cookieToken) {
        // Handle the case where the token is missing or empty
        return;
      }
      //axios.defaults.headers.common["Authorization"] = `Bearer ${cookieToken}`;
      setFilter("all");
      const res = await axios.get(`/todos/`, {
        headers: {
          Authorization: cookieToken,
        },
      });
      console.log(res.data.data);
      setTodos(res.data.data);
    } catch (error) {
      console.error("Error fetching todos:", error);

      handleResState("error", "API Fetch Failued", error.response.data.message);
    }
  };

  //新增待辦事項
  const addTodo = async () => {
    if (!newTodo) return;
    try {
      const res = await axios.post(
        `/todos`,
        {
          content: newTodo,
        },
        {
          headers: {
            Authorization: cookieToken,
          },
        }
      );
      console.log("addtodo", res);
      setNewTodo("");
      setFilter("all");
      getTodos();
      Swal.fire({
        icon: "success",
        title: "Todo added",
        text: "",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error adding todo:", error);
      handleResState(
        "error",
        "Failed to add todo",
        error.response?.data?.message || "Unknown error occurred"
      );
    }
  };

  //登出log out
  const logout = async (e) => {
    e.preventDefault();
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
      } else if (res.isDenied) {
        return;
      }
    });
  };

  //變更狀態
  const toggleTodo = async (id) => {
    try {
      const rest = await axios.patch(`${VITE_APP_HOST}/todos/${id}/toggle`);
      getTodos();
    } catch (error) {
      handleResState("error", "edit Failed");
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
              <NavLink to="#">
                <span>{nickname}的代辦</span>
              </NavLink>
            </li>
            <li>
              <button onClick={logout}>Log out</button>
            </li>
          </ul>
        </nav>
        <div className="conatiner todoListPage vhContainer">
          <div className="todoList_Content">
            <div className="inputBox">
              <input
                type="text"
                placeholder="Enter to do"
                value={newTodo}
                onChange={(e) => {
                  setNewTodo(e.target.value);
                }}
              />
              {/*ref={newTodo}*/}
              <button className="formControls_btnLink" onClick={addTodo}>
                <i className="fa fa-plus"></i>
              </button>
            </div>
            <div className="todoList_list">
              <ul className="todoList_tab">
                <li className={filter == "all" ? "tab active" : "tab"}>
                  <div className="" onClick={() => setFilter("all")}>
                    All
                  </div>
                </li>
                <li className={filter == "all" ? "tab active" : "tab"}>
                  <div className="" onClick={() => setFilter("doing")}>
                    Doing
                  </div>
                </li>
                <li className={filter == "all" ? "tab active" : "tab"}>
                  <div className="" onClick={() => setFilter("done")}>
                    Done
                  </div>
                </li>
              </ul>
              <div className="todoList_items">
                <ul className="todoList_item">
                  {todos.map((todo, index) => {
                    return (
                      <>
                        <li key={todo.id}>
                          <label className="todoList_label">
                            <input
                              className="todoList_input"
                              type="checkbox"
                              value="true"
                              checked={todo.status}
                              onChange={() => toggleTodo(todo.id)}
                            />
                            <span>{todo.content}</span>
                          </label>
                          <a href="#">
                            <i className="fa fa-times"></i>
                          </a>
                        </li>
                      </>
                    );
                  })}

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
                  <p>
                    {" "}
                    {todos.filter((item) => item.status === false).length}{" "}
                    個已完成項目
                  </p>
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
