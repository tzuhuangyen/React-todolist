import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import handleResState from "../utilits/handleResState";
import { render } from "react-dom";
//import Loading from "../utilits/Loading";
const { VITE_APP_HOST } = import.meta.env;
console.log(VITE_APP_HOST);
const cookieToken = document.cookie
  .split(";")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];
axios.defaults.headers.common["Authorization"] = cookieToken;

const List = ({ todos, getTodos }) => {
  const [filterStatus, setFilterStatus] = useState(todos);
  const [tab, setTab] = useState("all");
  // 点击待办事项文本时触发编辑模式
  const setEditModeForItem = (id) => {
    setEditMode(id);
    setEditContent(""); // 清空编辑内容
  };

  useEffect(() => {
    setFilterStatus(todos);
    setTab("all");
  }, [todos]);

  // 每次切換頁籤時更新篩選完的狀態
  useEffect(() => {
    if (tab == "all") {
      setFilterStatus(todos);
    } else if (tab == "doing") {
      setFilterStatus(todos.filter((todo) => !todo.status));
    } else if (tab == "done") {
      setFilterStatus(todos.filter((todo) => todo.status));
    }
  }, [tab]);

  const handleList = (e) => {
    setTab(e.target.textContent);
  };

  // 切換待辦事項狀態
  const toggleStatus = async (id) => {
    try {
      const rest = await axios.patch(
        `${VITE_APP_HOST}/todos/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: cookieToken,
          },
        }
      );
      getTodos();
    } catch (error) {
      handleResState("error", "edit Failed");
    }
  };
  //更新待辦事項
  const [editContent, setEditContent] = useState("");
  const [editMode, setEditMode] = useState(null);

  const updateTodo = async (id) => {
    try {
      const res = await axios.put(
        `${VITE_APP_HOST}/todos/${id}`,
        {
          content: editContent,
        },
        {
          headers: {
            Authorization: cookieToken,
          },
        }
      );
      //console.log(res);
      // Clear the editContent for this todo item
      // 清除编辑模式并显示成功消息
      await new Promise((resolve) => {
        setEditMode(null);
        resolve();
      });

      Swal.fire({
        toast: "true",
        icon: "success",
        position: "top-start",
        text: res.data.message,
        showConfirmButton: false,
        timer: 1000,
      });
      getTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
      handleResState("error", "update Failed");
    }
  };

  const keyDownToUpdate = (e, id) => {
    e.key === "Enter" ? updateTodo(id) : null;
  };

  //刪除all待辦事項
  const deleteAllDone = () => {
    todos.filter((todo) =>
      todo.status
        ? axios.delete(`${VITE_APP_HOST}/todos/${todo.id}`, {
            headers: {
              Authorization: cookieToken,
            },
          })
        : todo
    );
    Swal.fire({
      icon: "success",
      title: "Done",
      text: "All completed todos are deleted",
      showConfirmButton: true,
    });
    getTodos();
  };

  //刪除待辦
  const deleteTodo = async (id) => {
    console.log(`Deleting todo with id: ${id}`);
    try {
      const res = await axios.delete(`${VITE_APP_HOST}/todos/${id}`, {
        headers: {
          Authorization: cookieToken,
        },
      });
      Swal.fire({
        icon: "warning",
        title: "Delete?",
        text: "Are you sure you want to delete?",
        showConfirmButton: true,
        //showDenyButton: true,
      });
      getTodos();
    } catch (error) {
      handleResState("error", error.response.data.message);
    }
  };

  return (
    <div>
      {/* {選染待辦清單} */} {/* {選染頁籤} */}
      {/* <div className="todoList_list">
        <ul>
          <li
            className="todolist-tab"
            style={
              tab == "all"
                ? {
                    color: "#333333",
                    borderBottom: "2px solid #333333",
                  }
                : null
            }
          >
            <NavLink onClick={handleList}>all</NavLink>
          </li>
          <li
            className="todolist-tab"
            style={
              tab == "doing"
                ? {
                    color: "#333333",
                    borderBottom: "2px solid #333333",
                  }
                : null
            }
          >
            <NavLink onClick={handleList}>doing</NavLink>
          </li>
          <li
            className="todolist-tab"
            style={
              tab == "done"
                ? {
                    color: "#333333",
                    borderBottom: "2px solid #333333",
                  }
                : null
            }
          >
            <NavLink onClick={handleList}>done</NavLink>
          </li>
        </ul>
        </div> */}
      {todos.length === 0 ? (
        <div className="todoList_list">
          {/* {選染頁籤} */}

          <li
            className="todoList_label"
            style={{ justifyContent: "space-around", cursor: "auto" }}
          >
            目前尚無項目
          </li>
        </div>
      ) : (
        <>
          <div className="todoList_list">
            {/* {選染頁籤} */}
            <ul>
              <li
                className="todolist-tab"
                style={
                  tab == "all"
                    ? {
                        color: "#333333",
                        borderBottom: "2px solid #333333",
                      }
                    : null
                }
              >
                <NavLink onClick={handleList}>all</NavLink>
              </li>
              <li
                className="todolist-tab"
                style={
                  tab == "doing"
                    ? {
                        color: "#333333",
                        borderBottom: "2px solid #333333",
                      }
                    : null
                }
              >
                <NavLink onClick={handleList}>doing</NavLink>
              </li>
              <li
                className="todolist-tab"
                style={
                  tab == "done"
                    ? {
                        color: "#333333",
                        borderBottom: "2px solid #333333",
                      }
                    : null
                }
              >
                <NavLink onClick={handleList}>done</NavLink>
              </li>
            </ul>
            {/* {選染事項list} */}
            <div className="todoList_items">
              <ul className="todoList_item flex-direction-column">
                {filterStatus.map((item) => {
                  return (
                    <li key={item.id}>
                      <div className="todoList_label ">
                        <input
                          id={item.id}
                          type="checkbox"
                          className="todoList_input"
                          value={item.status}
                          checked={item.status}
                          onChange={() => toggleStatus(item.id)}
                        />
                        {editMode === item.id ? (
                          <>
                            <input
                              type="text"
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              onKeyDown={(e) => keyDownToUpdate(e, item.id)}
                            />
                            <button
                              className="formControls_btnLink"
                              onClick={(e) => updateTodo(item.id)}
                            >
                              修改
                            </button>
                            <button
                              className="formControls_btnLink"
                              onClick={(e) => setEditMode(null)}
                            >
                              取消
                            </button>
                          </>
                        ) : (
                          // 否则，显示待办事项文本
                          <label
                            htmlFor={item.id}
                            onClick={() => setEditModeForItem(item.id)}
                          >
                            {item.content}
                          </label>
                        )}
                        <span onClick={(e) => setEditMode(item.id)}></span>
                      </div>
                      <a onClick={(e) => deleteTodo(item.id)}>
                        <i className="fa fa-times"></i>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="todoList_statistics">
                <p>
                  {todos?.filter((item) => item.status).length}
                  個已完成項目
                </p>
                <a onClick={deleteAllDone}>清除已完成項目</a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  //List元件end
};

function Todos() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ content: "" });
  const [message, setMessage] = useState("");
  const [editContent, setEditContent] = useState("");
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

  return (
    <div>
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  ); //Todos retrun的）
  //Todos最外層的}了
}

export default Todos;
