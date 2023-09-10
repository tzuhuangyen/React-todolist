import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import handleResState from "../utilits/handleResState";
import axios from "axios";
import Swal from "sweetalert2";
const { VITE_APP_HOST } = import.meta.env;
//console.log(VITE_APP_HOST);
const cookieToken = document.cookie
  .split(";")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];
axios.defaults.headers.common["Authorization"] = cookieToken;

const List = ({ todos, getTodos }) => {
  const [tab, setTab] = useState("");
  const [filterStatus, setFilterStatus] = useState(todos);

  //在事件触发时，根据事件目标元素的文本内容来更新  setTab  的值。
  const handleList = (e, setTab) => {
    setTab(e.target.textContent);
  };
  // 点击待办事项文本时触发编辑模式
  const setEditModeForItem = (id) => {
    setEditMode(id);
    setEditContent(""); // 清空编辑内容
  };
  //在todos发生变化时，更新筛选后的状态，并将选项卡设置为"all"。
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

  // 切換checked待辦事項狀態
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
        position: "center",
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
  //List render
  return (
    <div className="todoList_list ">
      {/* {選染頁籤} */}
      <ul className="todoList_tab">
        <li
          style={
            tab == "all"
              ? {
                  color: "#333333",
                  borderBottom: "2px solid #333333",
                }
              : null
          }
        >
          <NavLink onClick={(e) => handleList(e, setTab)}>all</NavLink>
        </li>
        <li
          style={
            tab == "doing"
              ? {
                  color: "#333333",
                  borderBottom: "2px solid #333333",
                }
              : null
          }
        >
          <NavLink onClick={(e) => handleList(e, setTab)}>doing</NavLink>
        </li>
        <li
          style={
            tab == "done"
              ? {
                  color: "#333333",
                  borderBottom: "2px solid #333333",
                }
              : null
          }
        >
          <NavLink onClick={(e) => handleList(e, setTab)}>done</NavLink>
        </li>
      </ul>
      {/* {選染待辦清單} */}
      <div className="todoList_items">
        <ul className=" todoList_item">
          {todos.length === 0 ? (
            <li
              className="todoList_label"
              style={{ justifyContent: "space-around", cursor: "auto" }}
            >
              目前尚無項目
            </li>
          ) : (
            <>
              {/* {選染事項list} */}
              <div className="todoList_items">
                <ul className="todoList_item ">
                  {filterStatus.map((item) => {
                    return (
                      <li key={item.id}>
                        <label className="todoList_label ">
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
                        </label>
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
            </>
          )}
        </ul>
      </div>
    </div>
  );

  //List元件end
};
export default List;
