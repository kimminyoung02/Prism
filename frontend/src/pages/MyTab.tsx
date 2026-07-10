import { useAuth } from "../store/AuthContext"
import LoginPage from "./LoginPage"
import MyPage from "./MyPage"

export default function MyTab() {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return null
  return isLoggedIn ? <MyPage /> : <LoginPage />
}
