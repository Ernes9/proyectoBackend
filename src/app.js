import express from "express";
import handlebars from "express-handlebars";
import productsApiRouter from "./routes/productos.api.js";
import productsRouter from "./routes/productos.js";
import cartRouter from "./routes/carts.js";
import realTimeProductsRouter from "./routes/realTimeProducts.js";
import sessionRouter from "./routes/sessionRouter.js";
import { Server as HTTPServer } from "http";
import { Server as SocketServer} from "socket.io";
import productManager from "./dao/mongo/productManager.js";
import mongoose from "mongoose";
import chatRouter from "./routes/chatRoute.js";
import messagesManagerDB from "./dao/mongo/chatManager.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import crypto from "crypto"
import authRouter from "./routes/auth.js";
import InitLocalStrategy from "./config/passport.config.js";


const conn = await mongoose.connect('mongodb+srv://ecommerce:VtSDF3xVOpBLehR2@ecommerce.upmp7t0.mongodb.net/ecommerce')
export const messageManager = new messagesManagerDB();

const app = express();

const httpServer = HTTPServer(app);
const io = new SocketServer(httpServer);

const fileStorage = FileStore(session)

app.engine("handlebars", handlebars.engine());
app.set("views", "./views");
app.set("view engine", "handlebars");

InitLocalStrategy()

// Nos transforma la informacion que venga de los query params para poder utilizarla como objeto
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./public"))
app.use((req, res, next) => {
    req.io = io;
    next();
})
app.use(cookieParser())
app.use(session({
    store: new MongoStore({
        mongoUrl: 'mongodb+srv://ecommerce:VtSDF3xVOpBLehR2@ecommerce.upmp7t0.mongodb.net/ecommerce',
        ttl: 30,
    }),
    secret: crypto.randomBytes(64).toString('hex'),
    resave: true,
    saveUninitialized: true
}))


app.use("/api/productos", productsApiRouter)
app.use("/api/cart", cartRouter)
app.use("/api/auth", authRouter)
app.use("/productos", productsRouter)
app.use("/realtimeproducts", realTimeProductsRouter)
app.use("/chat", chatRouter)
app.use("/session", sessionRouter)



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
