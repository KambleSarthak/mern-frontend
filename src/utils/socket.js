// frontendtb/src/utils/socket.js
import io from "socket.io-client";

export const createSocketConnection = () => {
  if (window.location.hostname === "localhost") {
    return io("http://localhost:7000");
  } else {
    return io("https://mern-backend-one-lake.vercel.app", {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      secure: true
    });
  }
};