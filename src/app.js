import express from "express";
import handlebars from "express-handlebars";
import productsApiRouter from "./routes/products.router.js";
import productsRouter from "./routes/products.views.js";
import cartApiRouter from "./routes/carts.router.js";
import cartRouter from "./routes/carts.views.js";
import realTimeProductsRouter from "./routes/realTimeProducts.view.js";
import sessionRouter from "./routes/user.router.js";
import { Server as HTTPServer } from "http";
import { Server as SocketServer } from "socket.io";
import mongoose from "mongoose";
import chatRouter from "./routes/chat.views.js";
import messagesManagerDB from "./dao/mongo/chatManager.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import crypto from "crypto";
import authRouter from "./routes/auth.views.js";
import loggerRouter from "./routes/logger.router.js";
import InitLocalStrategy from "./config/passport.config.js";
import ProductDAO from "./dao/mongo/product.dao.js";
import mockingRouter from "./routes/mocking.router.js";
import winston from "./utils/winston.middleware.js";
import winstonErrorMiddleware from "./utils/winstonError.middleware.js";
import cluster from "cluster";
import { cpus } from "os";
import ENV_CONFIG from "./config/config.js";
import compression from "express-compression";

import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";

// DIRNAME
// Lo tuve que poner en el app, porque si no me daba error
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import passport from "passport";

const __dirname = dirname(fileURLToPath(import.meta.url));

const conn = await mongoose.connect(ENV_CONFIG.MONGO_URI);
export const messageManager = new messagesManagerDB();

const swaggerConfig = {
definition: {
  openapi: "3.0.1",
  info: {
    title: "ECOMMERCE API",
    description: "Tienda de productos",
  },
},
apis: [
  __dirname + "/docs/carts.docs.yaml",
  __dirname + "/docs/products.docs.yaml",
  __dirname + "/docs/user.docs.yaml"
],
};

const specs = swaggerJSDoc(swaggerConfig);

const productDAO = new ProductDAO();

const app = express();

const httpServer = HTTPServer(app);
const io = new SocketServer(httpServer);

const fileStorage = FileStore(session);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


app.use(
  session({
    store: new MongoStore({
      mongoUrl: ENV_CONFIG.MONGO_URI,
      ttl: 30,
    }),
    secret: crypto.randomBytes(64).toString("hex"),
    resave: true,
    saveUninitialized: true,
  })
  );
  
InitLocalStrategy();
app.use(passport.initialize());
app.use(passport.session());
  
// Nos transforma la informacion que venga de los query params para poder utilizarla como objeto
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(cookieParser());
app.use(winston);
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);




app.use("/api/docs", serve, setup(specs));
app.use("/api/productos", productsApiRouter);
app.use("/api/cart", cartApiRouter);
app.use("/api/auth", authRouter);
app.use("/productos", productsRouter);
app.use("/cart", cartRouter);
app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/chat", chatRouter);
app.use("/session", sessionRouter);
app.use("/mockingproducts", mockingRouter);
app.use("/api/loggers", loggerRouter);

const numberOfProcess = cpus().length;

app.use(winstonErrorMiddleware);

if (cluster.isPrimary) {
  console.log("Primary");
  for (let i = 1; i <= numberOfProcess; i++) {
    cluster.fork();
  }
} else {
  console.log("worker", process.pid);
  httpServer.listen(8080, () => console.log(`Escuchando en el puerto 8080`));
}

// httpServer.listen(8080, () => console.log(`Escuchando en el puerto 8080`));

io.on("connection", async (socket) => {
  console.log("Socket conectado!");
  const productos = await productDAO.findAll();
  socket.emit("renderProductos", productos);

  socket.on('new_product', async (data) => {
    await productDAO.create(data)    
    socket.emit('renderProductos', await productDAO.findAll())     
  })

  socket.on('mod_product', async (data) => {   
    const userInfo = {
      email: data.userEmail,
      role: data.userRole,
    };        
    if (userInfo.role == 'admin' || userInfo.role == 'premium'){
      await productDAO.update(data.id,data)
      socket.emit('renderProductos', await productDAO.findAll())
    }else{
      return console.error({ error: 'No puedes modificar este producto' })
    }
  })

  socket.on('delete_product',async (data) => {
    console.log(data.pid)
      const prod = await productDAO.findById(data.pid)
      const userInfo = {
        email: data.userEmail,
        role: data.userRole,
      };
      if (userInfo.role == 'admin' || userInfo.role == 'premium'){
        await productDAO.delete(data.pid)
        socket.emit('renderProductos', await productDAO.findAll())
      }else{
        return console.error({ error: 'No puedes eliminar este producto' })
      }
  })

  const messages = await messageManager.getMessages();
  socket.emit("historial", messages);

  socket.on("message", async (data) => {
    let user = data.username;
    let message = data.text;
    await messageManager.addMessage(user, message);
    const messages = await messageManager.getMessages();
    socket.emit("messageLogs", messages);
  });
});
