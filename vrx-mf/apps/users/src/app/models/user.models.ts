export interface User {
  id: string;
  name: string;
  role: string;
  lastLogin: string;
  email?: string;
  status?: string;
  avatar?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
}
