interface User {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address?: {
    street: string,
    city: string,
  };
}

export default User;
