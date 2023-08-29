import UserModel from "../../schemas/user.schema.js";
import bcrypt from "bcrypt"

class UserManager{
    constructor(){
        
    }

    async getUsuarios() {
        try{
            const users = await UserModel.find();
            return users;
        } catch (e){
            console.log(e);
        };
      }

    async getUsuarioByEmail(email) {
        try{
            const user = await UserModel.findOne({ email });
            return user;
        } catch (e){
            console.log(e);
        }; 
    }

    async getUsuarioByUsername(username) {
        try{
            const user = await UserModel.findOne({ username });
            return user;
        } catch (e){
            console.log(e);
        }; 
    }

    async createUser(first_name, last_name, username, email, password){
        try {
            const emailExists = await UserModel.find({email})
            if (emailExists.length) return "El mail ya existe"
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            const usuario = await UserModel.create({first_name, last_name, username, email, password});
            return usuario.toObject();
        } catch (e){
            console.log(e);
        }; 
    }

    async validateUser(email, password){
        try{
            const user = await UserModel.findOne({ email });
            if (!user) return false;
            const isEqual = await bcrypt.compare(password, user.password);
            return isEqual ? user.toObject() : false;
        } catch (e){
            console.log(e);
        }; 
    }
}

const userManager = new UserManager();

export default userManager;