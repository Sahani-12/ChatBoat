import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v4 as uuid } from "uuid";
import logoImage from "./assets/blacklogo.png";
import { API_BASE_URL } from "./config";

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
    isSidebarOpen,
    setIsSidebarOpen,
  } = useContext(MyContext);

  const getAllThreds = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/thread`);
      const res = await response.json();
      if (!Array.isArray(res)) {
        setAllThreads([]);
        return;
      }
      const filterData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setAllThreads(filterData);
    } catch (err) {
      console.log(err);
      setAllThreads([]);
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
    if (typeof setIsSidebarOpen === "function") setIsSidebarOpen(false);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    if (typeof setIsSidebarOpen === "function") setIsSidebarOpen(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/thread/${newThreadId}`);
      const res = await response.json();

      setPrevChats(Array.isArray(res) ? res : []);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
      setPrevChats([]);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      await fetch(`${API_BASE_URL}/api/thread/${threadId}`, {
        method: "DELETE",
      });
      setAllThreads((prev) =>
        Array.isArray(prev) ? prev.filter((thread) => thread.threadId !== threadId) : []
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`sidebarOverlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen?.(false)}
      ></div>

      <section className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Top Header Nav */}
        <div className="sidebarTop">
          <div className="sidebarHeaderNav">
            <div className="logoBrand" onClick={createNewChat}>
              <div className="gptLogoIcon">
                <img src={logoImage} alt="ChatBoat Logo" className="logoImg" />
              </div>
              <span className="brandName">ChatBoat</span>
            </div>

            <div className="sidebarHeaderActions">
              <button
                className="iconBtn newChatIconBtn"
                onClick={createNewChat}
                title="New chat"
              >
                <i className="fa-regular fa-pen-to-square"></i>
              </button>
              <button
                className="iconBtn closeSidebarBtn"
                onClick={() => setIsSidebarOpen?.(false)}
                title="Close sidebar"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="historyContainer">
          <div className="historySectionHeader">
            <span>Chats</span>
          </div>
          <ul className="historyList">
            {allThreads?.length > 0 ? (
              allThreads.map((thread, idx) => (
                <li
                  key={idx}
                  onClick={() => changeThread(thread.threadId)}
                  className={`historyItem ${
                    currThreadId === thread.threadId ? "active" : ""
                  }`}
                >
                  <span className="threadTitle">{thread.title || "New chat"}</span>
                  <div className="itemActions">
                    <i
                      className="fa-regular fa-trash-can deleteBtn"
                      title="Delete chat"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteThread(thread.threadId);
                      }}
                    ></i>
                  </div>
                </li>
              ))
            ) : (
              <div className="emptyHistory">No chat history</div>
            )}
          </ul>
        </div>

        {/* Bottom User Profile Footer */}
        <div className="sidebarFooter">
          <div className="userProfileCard">
            <div className="userAvatarCircle">A</div>
            <div className="userInfo">
              <span className="userName">Anand</span>
              <span className="userPlan">Free Plan</span>
            </div>
            <div className="upgradeBtn">
              <span>Upgrade</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
