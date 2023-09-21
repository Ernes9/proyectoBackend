import { Router } from "express";
import { messageManager } from "../app.js";

const chatRouter = Router()

chatRouter.get('/', async (req, res) => {
    const messages = await messageManager.getMessages();
    
    res.render('chat', { messages });
});



export default chatRouter;