import "./Chat.css";
import { MyContext } from "./MyContext.jsx";
import { useContext, useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import logoImage from "./assets/blacklogo.png";

function Chat() {
  const { newChat, prevChats, reply, setPromt } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [prevChats, latestReply]);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }

    if (!prevChats.length) return;
    const content = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  const promptSuggestions = [
    {
      icon: "fa-code",
      title: "Write code",
      prompt: "Write a Java program to sort an array using QuickSort",
    },
    {
      icon: "fa-lightbulb",
      title: "Explain concept",
      prompt: "Explain how React hooks and Virtual DOM work in simple terms",
    },
    {
      icon: "fa-envelope",
      title: "Draft email",
      prompt: "Write a professional email requesting a project deadline extension",
    },
    {
      icon: "fa-bug",
      title: "Debug code",
      prompt: "What are common memory leak causes in modern Web Applications?",
    },
  ];

  const handleCardClick = (promptText) => {
    setPromt?.(promptText);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const isHeroView = newChat && prevChats.length === 0;

  return (
    <div className="chatContainer">
      {isHeroView ? (
        <div className="heroView">
          <div className="heroHeader">
            <div className="heroGptBadge">
              <img src={logoImage} alt="ChatBoat Logo" className="heroLogoImg" />
            </div>
            <h1>What can I help with today?</h1>
          </div>

          <div className="suggestionGrid">
            {promptSuggestions.map((item, index) => (
              <div
                key={index}
                className="suggestionCard"
                onClick={() => handleCardClick(item.prompt)}
              >
                <div className="cardHeader">
                  <i className={`fa-solid ${item.icon} cardIcon`}></i>
                  <span>{item.title}</span>
                </div>
                <p className="cardPrompt">{item.prompt}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="chats">
          {prevChats?.slice(0, -1).map((chat, idx) => (
            <div
              className={chat.role === "user" ? "userRow" : "gptRow"}
              key={idx}
            >
              {chat.role === "user" ? (
                <div className="userMessageBubble">
                  {chat.content}
                </div>
              ) : (
                <div className="gptMessageWrapper">
                  <div className="gptAvatar">
                    <img src={logoImage} alt="AI Logo" className="chatLogoImg" />
                  </div>
                  <div className="gptContentBody">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                      {chat.content}
                    </ReactMarkdown>
                    <div className="msgActionBar">
                      <button
                        className="actionBtn"
                        title="Copy message"
                        onClick={() => copyToClipboard(chat.content, idx)}
                      >
                        <i
                          className={
                            copiedIdx === idx
                              ? "fa-solid fa-check"
                              : "fa-regular fa-copy"
                          }
                        ></i>
                      </button>
                      <button className="actionBtn" title="Good response">
                        <i className="fa-regular fa-thumbs-up"></i>
                      </button>
                      <button className="actionBtn" title="Bad response">
                        <i className="fa-regular fa-thumbs-down"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {prevChats.length > 0 && (
            <div className="gptRow" key="latest-message">
              <div className="gptMessageWrapper">
                <div className="gptAvatar">
                  <img src={logoImage} alt="AI Logo" className="chatLogoImg" />
                </div>
                <div className="gptContentBody">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {latestReply === null
                      ? prevChats[prevChats.length - 1].content
                      : latestReply}
                  </ReactMarkdown>
                  <div className="msgActionBar">
                    <button
                      className="actionBtn"
                      title="Copy message"
                      onClick={() =>
                        copyToClipboard(
                          latestReply === null
                            ? prevChats[prevChats.length - 1].content
                            : latestReply,
                          "latest"
                        )
                      }
                    >
                      <i
                        className={
                          copiedIdx === "latest"
                            ? "fa-solid fa-check"
                            : "fa-regular fa-copy"
                        }
                      ></i>
                    </button>
                    <button className="actionBtn" title="Good response">
                      <i className="fa-regular fa-thumbs-up"></i>
                    </button>
                    <button className="actionBtn" title="Bad response">
                      <i className="fa-regular fa-thumbs-down"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}

export default Chat;
