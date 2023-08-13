import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
})

const ChatModel = mongoose.model("messages", chatSchema);

export default ChatModel;