export interface User {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'teacher' | 'student'
}
