import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v4 as uuid } from "uuid";
import logoImage from "./assets/blacklogo.png";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPromt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreds = async () => {
    try {
      const response = await fetch(
        "https://chatboat-api.onrender.com/api/thread"
      );
      const res = await response.json();
      const filterData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      console.log(filterData);
      setAllThreads(filterData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreds();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPromt("");
    setReply(null);
    setCurrThreadId(uuid());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `https://chatboat-api.onrender.com/api/thread/${newThreadId}`
      );
      const res = await response.json();

      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `https://chatboat-api.onrender.com/api/thread/${threadId}`,
        {
          method: "DELETE",
        }
      );
      const res = await response.json();
      console.log(res);
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src={logoImage} alt="chatbot logo" className="logo" />
        <span className="fa-solid fa-pen-to-square"></span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={(e) => changeThread(thread.threadId)}
            className={currThreadId === thread.threadId ? "highlighted" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p> Anand &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
