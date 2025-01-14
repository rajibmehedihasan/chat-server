import { Server } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import app from "./app";
import { connectDB, Message } from "./database";

let server: Server;

connectDB();

server = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

const io = new SocketServer(server);

io.on("connection", (socket: Socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });

    socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message);
    });

    socket.on("sendMessage", async (data) => {
        const { senderId, receiverId, message } = data;
        const msg = new Message({ senderId, receiverId, message });

        await msg.save();

        io.to(receiverId).emit("receiveMessage", msg);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
