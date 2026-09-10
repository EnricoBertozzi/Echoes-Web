import { useNavigate } from "react-router"

export function useLogin() {
  const navigate = useNavigate();

  async function login() {
    navigate('/dashboard');
  }

  return {
    login,
  }
}
