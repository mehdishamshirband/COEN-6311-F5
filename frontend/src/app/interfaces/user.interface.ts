export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  phone?: string;
  country?: string;
  province?: string;
  city?: string;
  zipcode?: string;
  firstLineAddress?: string;
  secondLineAddress?: string;
}

export interface GuestProfile {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  country: string;
  state_area: string;
  city: string;
  zipCode: string;
  firstLineAddress: string;
  secondLineAddress?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  first_Name: string;
  last_Name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserForgetPassword {
  email: string;
}

export interface UserResetPassword {
  email: string;
  reset_code: string;
  new_password: string;
  confirmPassword: string;
}
