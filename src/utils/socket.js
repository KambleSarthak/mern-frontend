import io from "socket.io-client";

export const createSocketConnection = () => {
  const socketUrl = process.env.REACT_APP_SOCKET_URL || "/";
  return io(socketUrl, { path: "/api/socket.io" });
};
