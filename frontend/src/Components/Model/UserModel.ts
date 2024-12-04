export interface User {
    id:number;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    mobileNumber: string;
    gender:string;
    roles:string;
  }

  export interface UserLogin {
    email: string,
    password: string,
  }