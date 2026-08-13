import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { API_BASE_URL } from "./config";

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
    addMessages,
    setIsSidebarOpen,
  } = useContext(MyContext) || {};

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modelDropdown, setModelDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Gemini 3.5 Flash");

  const getReply = async () => {
    if (!promt || promt.trim() === "" || loading) return;
    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: promt, threadId: currThreadId }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, options);
      const res = await response.json();
      console.log("api response:", res);

      const normalizedReply =
        res.reply ||
        res.content ||
        res.error ||
        (typeof res === "string" ? res : JSON.stringify(res));

      setReply(normalizedReply);

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

  useEffect(() => {
    if (!reply) return;
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
    setPromt?.("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
    setModelDropdown(false);
  };

  return (
    <div className="chatWindow">
      {/* Top Navbar */}
      <div className="navbar">
        <div className="navLeft">
          <button
            className="menuToggleBtn"
            onClick={() => setIsSidebarOpen?.((prev) => !prev)}
            aria-label="Toggle Sidebar"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          {/* Model Selector Dropdown */}
          <div className="modelSelectorWrapper">
            <button
              className="modelSelectorBtn"
              onClick={() => {
                setModelDropdown(!modelDropdown);
                setIsOpen(false);
              }}
            >
              <span className="modelName">ChatBoat</span>
              <span className="modelVersion">{selectedModel}</span>
              <i className="fa-solid fa-chevron-down chevronIcon"></i>
            </button>

            {modelDropdown && (
              <div className="modelDropdownMenu">
                <div
                  className={`modelOption ${
                    selectedModel === "Gemini 3.5 Flash" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedModel("Gemini 3.5 Flash");
                    setModelDropdown(false);
                  }}
                >
                  <div className="modelOptionHeader">
                    <i className="fa-solid fa-bolt"></i>
                    <span>Gemini 3.5 Flash</span>
                  </div>
                  <p className="modelDesc">Fast, smart and versatile model</p>
                </div>
                <div
                  className={`modelOption ${
                    selectedModel === "Gemini 3.5 Pro" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedModel("Gemini 3.5 Pro");
                    setModelDropdown(false);
                  }}
                >
                  <div className="modelOptionHeader">
                    <i className="fa-solid fa-sparkles"></i>
                    <span>Gemini 3.5 Pro</span>
                  </div>
                  <p className="modelDesc">Advanced reasoning and complex tasks</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="navRight">
          <div className="userIconDiv" onClick={handleProfileClick}>
            <div className="userAvatarCircle">A</div>
          </div>
        </div>

        {isOpen && (
          <div className="dropDown">
            <div className="dropDownItem">
              <i className="fa-solid fa-gear"></i> Settings
            </div>
            <div className="dropDownItem">
              <i className="fa-solid fa-sparkles"></i> Upgrade Plan
            </div>
            <div className="dropDownItem logout">
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Content */}
      <Chat />

      {/* Thinking Indicator */}
      {loading && (
        <div className="loadingWrapper">
          <ScaleLoader color="#ececec" height={18} width={2} radius={2} />
          <span>Thinking...</span>
        </div>
      )}

      {/* ChatGPT Signature Input Field */}
      <div className="chatInput">
        <div className="inputBox">
          <button className="attachBtn" title="Attach file">
            <i className="fa-solid fa-paperclip"></i>
          </button>

          <input
            placeholder="Message ChatBoat..."
            value={promt || ""}
            onChange={(e) => setPromt?.(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : null)}
            disabled={loading}
          />

          <button className="micBtn" title="Voice input">
            <i className="fa-solid fa-microphone"></i>
          </button>

          <button
            id="submit"
            className={promt && promt.trim() !== "" ? "active" : ""}
            onClick={getReply}
            disabled={loading || !promt || promt.trim() === ""}
            aria-label="Send Message"
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>

        <p className="info">
          ChatBoat can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
