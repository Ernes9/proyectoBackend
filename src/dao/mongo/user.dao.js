import UserModel from "../../schemas/user.schema.js";
import bcrypt from "bcrypt";

export default class UserDAO {
  constructor() {}

  async find() {
    return await UserModel.find();
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email: email });
  }

  async findByUsername(username) {
    return await UserModel.findOne({ username: username });
  }

  async findById(id) {
    return await UserModel.findById(id);
  }

  async create(user) {
    return await UserModel.insertMany(user);
  }
  //     try {
  //       let { first_name, last_name, username, email, password } = user;
  //       const emailExists = await UserModel.find({ email });
  //       if (emailExists.length) return "El mail ya existe";
  //       const salt = await bcrypt.genSalt(10);
  //       password = await bcrypt.hash(password, salt);
  //       const usuario = await UserModel.create({
  //         first_name,
  //         last_name,
  //         username,
  //         email,
  //         password,
  //       });
  //       return usuario.toObject();
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }

  // async validateUser(email, password){
  //     try{
  //         const user = await UserModel.findOne({ email });
  //         if (!user) return false;
  //         const isEqual = await bcrypt.compare(password, user.password);
  //         return isEqual ? user.toObject() : false;
  //     } catch (e){
  //         console.log(e);
  //     };
  // }
}
