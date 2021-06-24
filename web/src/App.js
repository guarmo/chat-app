import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

function App() {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");

    socketRef.current.on("message", ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
    return () => socketRef.current.disconnect();
  }, [chat]);

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    const { name, message } = state;
    socketRef.current.emit("message", { name, message });
    e.preventDefault();
    setState({ message: "", name });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div>
      <form onSubmit={onMessageSubmit}>
        <h1>Messenger</h1>
        <label htmlFor="name">
          <input
            type="text"
            name="name"
            value={state.name}
            onChange={(e) => onTextChange(e)}
          />
        </label>
        <label htmlFor="message">
          <input
            type="text"
            name="message"
            value={state.message}
            onChange={(e) => onTextChange(e)}
          />
        </label>
        <button>Send Message</button>
      </form>
      <div>
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
    </div>
  );
}

export default App;
