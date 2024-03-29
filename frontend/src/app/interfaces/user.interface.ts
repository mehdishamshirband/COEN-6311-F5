export interface User {
  id: number;
  emailAddress: string;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  phone?: string;
  country?: string;
  province?: string;
  city?: string;
  zipcode?: string;
}

export interface UserLogin {
  emailAddress: string;
  password: string;
}

export interface UserRegister {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export interface UserForgetPassword {
  emailAddress: string;
}
