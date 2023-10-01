export interface SignUpTypes {
  email: string;
  name: string;
  password: string;
}

export interface SignInTypes {
  email: string;
  password: string;
  refreshToken: string | null;
}
