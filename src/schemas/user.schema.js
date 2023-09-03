import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name:{
        type: String
    },
    last_name:{
        type: String
    },
    email:{
        type: String
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    cart:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "carts"
        }
    },
    role:{
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
})



const UserModel = mongoose.model("user", userSchema)
export default UserModel;