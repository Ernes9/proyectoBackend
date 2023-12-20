export default class UserDTO {
  constructor(user) {
    this.fullname = `${user.first_name} ${user.last_name}`;
    this.username = user.username;
    this.email = user.email;
    this.id = user._id;
    this.role = user.role;
  }
}
