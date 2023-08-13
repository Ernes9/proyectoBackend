import express from "express";
import handlebars from "express-handlebars";
import productsApiRouter from "./routes/productos.api.js";
import productsRouter from "./routes/productos.js";
import cartRouter from "./routes/carts.js";
import { Server as HTTPServer } from "http";
import { Server as SocketServer} from "socket.io";
import realTimeProductsRouter from "./routes/realTimeProducts.js";
import productManager from "./dao/mongo/productManager.js";
import mongoose from "mongoose";
import chatRouter from "./routes/chatRoute.js";
import messagesManagerDB from "./dao/mongo/chatManager.js";

const conn = await mongoose.connect('mongodb+srv://ecommerce:VtSDF3xVOpBLehR2@ecommerce.upmp7t0.mongodb.net/')
export const messageManager = new messagesManagerDB();

const app = express();

const httpServer = HTTPServer(app);
const io = new SocketServer(httpServer);


app.engine("handlebars", handlebars.engine());
app.set("views", "./views");
app.set("view engine", "handlebars");


// Nos transforma la informacion que venga de los query params para poder utilizarla como objeto
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./public"))
app.use((req, res, next) => {
    req.io = io;
    next();
})

app.use("/api/productos", productsApiRouter)
app.use("/api/cart", cartRouter)
app.use("/productos", productsRouter)
app.use("/realtimeproducts", realTimeProductsRouter)
app.use("/chat", chatRouter)



httpServer.listen(8080, () => console.log(`Escuchando en el puerto 8080`))


io.on("connection", async (socket) => {
    console.log("Socket conectado!")
    const productos = await productManager.getProducts();
    socket.emit("renderProductos", productos)

    const messages = await messageManager.getMessages();
    socket.emit("historial", messages)

    socket.on("message", async (data) => {
        let user = data.username;
        let message = data.text;
        await messageManager.addMessage(user, message);
        const messages = await messageManager.getMessages();
        socket.emit("messageLogs", messages);
    });
})
