import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected to Socket.io: ${socket.id}`);

    socket.on("join_ticket", (ticketId) => {
      socket.join(ticketId);
      console.log(`🎟️ Socket ${socket.id} joined ticket room: ${ticketId}`);
    });

    socket.on("leave_ticket", (ticketId) => {
      socket.leave(ticketId);
      console.log(`🎟️ Socket ${socket.id} left ticket room: ${ticketId}`);
    });

    socket.on("send_ticket_reply", (data) => {
      // data: { ticketId, reply: { author, at, body } }
      console.log(`📨 Reply received for ticket ${data.ticketId}:`, data.reply);
      // Broadcast to other users in the room
      socket.to(data.ticketId).emit("new_ticket_reply", data);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected from Socket.io: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
