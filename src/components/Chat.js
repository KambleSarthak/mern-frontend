import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import api from "../utils/axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?.user?._id;

  const fetchChatMessages = async () => {
    try {
      const chat = await api.get(`/chat/${targetUserId}`, {
        headers: { Authorization: `${user.token}` },
      });
      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text } = msg;
        return {
          firstname: senderId?.firstname,
          lastname: senderId?.lastname,
          text,
        };
      });
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();

    socket.emit("joinChat", {
      firstname: user.user.firstname,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstname, lastname, text }) => {
      setMessages((prev) => [...prev, { firstname, lastname, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstname: user.user.firstname,
      lastname: user.user.lastname,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={styles.container}
    >
      <div className="card shadow" style={styles.card}>
        <div
          className="card-header text-white text-center"
          style={styles.cardHeader}
        >
          <h3 className="mb-0">Chat</h3>
        </div>

        <div className="card-body" style={styles.chatBody}>
          {messages.map((msg, index) => {
            const isUserMessage = user.user.firstname === msg.firstname;
            return (
              <div
                key={index}
                className={`d-flex mb-3 ${
                  isUserMessage
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    backgroundColor: isUserMessage ? "#007bff" : "#6c757d",
                  }}
                >
                  <strong>
                    {msg.firstname} {msg.lastname}
                  </strong>
                  <p className="mb-1">{msg.text}</p>
                  <small className="text-light">2 hours ago</small>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="card-footer d-flex align-items-center"
          style={styles.cardFooter}
        >
          <input
            type="text"
            className="form-control"
            style={styles.input}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="btn btn-primary"
            style={styles.sendButton}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "700px",
    borderRadius: "10px",
    overflow: "hidden",
  },
  cardHeader: {
    background: "linear-gradient(to right, #00B4DB, #0083B0)",
  },
  chatBody: {
    height: "60vh",
    overflowY: "auto",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: "1rem",
    borderRadius: "0.75rem",
    color: "#fff",
  },
  cardFooter: {
    gap: "0.5rem",
  },
  input: {
    borderRadius: "0.4rem",
  },
  sendButton: {
    borderRadius: "0.4rem",
    fontWeight: "bold",
  },
};

export default Chat;
