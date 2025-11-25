// App.jsx
import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v4 as uuid } from "uuid";

function App() {
  const [promt, setPromt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuid());
  const [prevChats, setPrevChats] = useState([]); // array of messages
  const [newChat, setNewChat] = useState(true); // keep naming consistent
  const [allThreads,setAllThreads]=useState([]);

  // Example: optionally you can provide helper to add messages
  const addMessages = (messages) => {
    setPrevChats((prev = []) => [...prev, ...messages]);
  };

  const providerValues = {
    promt,
    setPromt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    addMessages,
    allThreads,
    setAllThreads
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
