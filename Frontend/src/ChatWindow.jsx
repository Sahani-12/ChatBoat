// ChatWindow.jsx
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    promt,
    setPromt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext) || {};

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    if (!promt || promt.trim() === "") return;
    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: promt, threadId: currThreadId }),
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json();
      console.log("api response:", res);

      // Normalize API reply to a string
      const normalizedReply =
        res.reply ||
        res.content ||
        (typeof res === "string" ? res : JSON.stringify(res));

      setReply(normalizedReply);

      // Append user + assistant to prevChats (use addMessages if provided)
      const userMsg = {
        id: Date.now().toString() + "-u",
        role: "user",
        content: promt,
      };
      const assistantMsg = {
        id: Date.now().toString() + "-a",
        role: "assistant",
        content: normalizedReply,
      };

      if (typeof addMessages === "function") {
        addMessages([userMsg, assistantMsg]);
      } else if (typeof setPrevChats === "function") {
        setPrevChats((prev = []) => [...prev, userMsg, assistantMsg]);
      } else {
        console.warn("setPrevChats / addMessages not available in context.");
      }
    } catch (error) {
      console.error("Error fetching reply:", error);
    } finally {
      setLoading(false);
      setPromt?.("");
    }
  };

  // Optional: effect to push reply if some other flow sets 'reply'
  useEffect(() => {
    if (!reply) return;
    // avoid doubling if already appended in getReply
    const last = prevChats?.[prevChats.length - 1];
    if (last?.role === "assistant" && last?.content === reply) return;

    if (typeof setPrevChats === "function") {
      setPrevChats((prev = []) => [
        ...prev,
        {
          id: Date.now().toString() + "-a-eff",
          role: "assistant",
          content: reply,
        },
      ]);
    }
    // clear prompt just in case
    setPromt?.("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reply]);


  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          ChatBoat <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i>Settings
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i>Upgrade plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>Log out
          </div>
        </div>
      )}

      <Chat />

      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={promt || ""}
            onChange={(e) => setPromt?.(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : null)}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          ChatBoat can make mistake. Check important info. See Cookie
          Preference.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
