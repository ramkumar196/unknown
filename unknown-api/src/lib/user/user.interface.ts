interface User {
  _id: string;
  userName: string;
  email: string;
  phone: string;
  password: string;
  resetToken: string;
  resetUpdateTime : Date;
}

export default User;
